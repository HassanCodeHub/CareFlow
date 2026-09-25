from datetime import date, datetime
from pathlib import Path
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection, init_db

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
init_db()
DEFAULT_USER_ID = 1


def error(message, status=400):
    return jsonify({"error": message}), status


def require_text(data, field, max_len=200):
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field.replace('_', ' ').capitalize()} is required.")
    value = value.strip()
    if len(value) > max_len:
        raise ValueError(f"{field.replace('_', ' ').capitalize()} is too long.")
    return value


def validate_date(value):
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except (TypeError, ValueError):
        raise ValueError("Date must use YYYY-MM-DD format.")


def validate_time(value):
    try:
        datetime.strptime(value, "%H:%M")
    except (TypeError, ValueError):
        raise ValueError("Time must use HH:MM format.")


def body():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ValueError("Request body must be valid JSON.")
    return data


def rows(sql, params=()):
    with get_connection() as conn:
        return [dict(r) for r in conn.execute(sql, params).fetchall()]


def one(sql, params=()):
    with get_connection() as conn:
        r = conn.execute(sql, params).fetchone()
        return dict(r) if r else None


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/dashboard")
def dashboard():
    today = date.today().isoformat()
    appointments = rows("SELECT * FROM appointments WHERE user_id=? ORDER BY date, time", (DEFAULT_USER_ID,))
    medications = rows("SELECT * FROM medications WHERE user_id=? AND status='active' ORDER BY schedule", (DEFAULT_USER_ID,))
    reminders = rows("SELECT * FROM reminders WHERE user_id=? ORDER BY completed, date, time", (DEFAULT_USER_ID,))
    events = rows("SELECT * FROM health_events WHERE user_id=? ORDER BY date DESC, id DESC LIMIT 5", (DEFAULT_USER_ID,))
    notes = rows("SELECT * FROM health_notes WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT 3", (DEFAULT_USER_ID,))
    return jsonify({
        "today": today,
        "appointments": appointments,
        "medications": medications,
        "reminders": reminders,
        "events": events,
        "notes": notes,
        "stats": {
            "upcoming_appointments": sum(a["status"] == "upcoming" and a["date"] >= today for a in appointments),
            "active_medications": len(medications),
            "pending_reminders": sum(not r["completed"] for r in reminders),
            "timeline_items": len(events),
        },
    })


@app.get("/api/appointments")
def get_appointments():
    return jsonify(rows("SELECT * FROM appointments WHERE user_id=? ORDER BY date DESC, time DESC", (DEFAULT_USER_ID,)))


@app.post("/api/appointments")
def create_appointment():
    try:
        data = body()
        title = require_text(data, "title")
        doctor = require_text(data, "doctor_name")
        dt = require_text(data, "date", 10); validate_date(dt)
        tm = require_text(data, "time", 5); validate_time(tm)
        location = str(data.get("location", "")).strip()[:200]
        status = str(data.get("status", "upcoming"))
        if status not in {"upcoming", "completed", "cancelled"}: raise ValueError("Invalid appointment status.")
        with get_connection() as conn:
            cur = conn.execute("INSERT INTO appointments (user_id,title,doctor_name,date,time,location,status) VALUES (?,?,?,?,?,?,?)", (DEFAULT_USER_ID,title,doctor,dt,tm,location,status))
            row = conn.execute("SELECT * FROM appointments WHERE id=?", (cur.lastrowid,)).fetchone()
        return jsonify(dict(row)), 201
    except ValueError as exc: return error(str(exc))
    except sqlite3.Error: return error("We couldn't save that appointment.", 500)


@app.patch("/api/appointments/<int:item_id>")
def update_appointment(item_id):
    try:
        data = body()
        existing = one("SELECT * FROM appointments WHERE id=? AND user_id=?", (item_id, DEFAULT_USER_ID))
        if not existing: return error("Appointment not found.", 404)
        allowed = {"title","doctor_name","date","time","location","status"}
        updates = {k: data[k] for k in allowed if k in data}
        for key in ("title", "doctor_name"):
            if key in updates: updates[key] = require_text({key: updates[key]}, key)
        if "date" in updates: validate_date(updates["date"])
        if "time" in updates: validate_time(updates["time"])
        if "status" in updates and updates["status"] not in {"upcoming","completed","cancelled"}: raise ValueError("Invalid appointment status.")
        if not updates: return error("No changes supplied.")
        assignments = ", ".join(f"{k}=?" for k in updates)
        with get_connection() as conn:
            conn.execute(f"UPDATE appointments SET {assignments} WHERE id=? AND user_id=?", (*updates.values(), item_id, DEFAULT_USER_ID))
            row = conn.execute("SELECT * FROM appointments WHERE id=?", (item_id,)).fetchone()
        return jsonify(dict(row))
    except ValueError as exc: return error(str(exc))
    except sqlite3.Error: return error("We couldn't update that appointment.", 500)


@app.delete("/api/appointments/<int:item_id>")
def delete_appointment(item_id):
    return delete_record("appointments", item_id, "Appointment")


@app.get("/api/medications")
def get_medications(): return jsonify(rows("SELECT * FROM medications WHERE user_id=? ORDER BY status, schedule", (DEFAULT_USER_ID,)))


@app.post("/api/medications")
def create_medication():
    try:
        data=body(); name=require_text(data,"name"); dosage=require_text(data,"dosage_label"); schedule=require_text(data,"schedule",100); start=require_text(data,"start_date",10); validate_date(start)
        end=data.get("end_date") or None
        if end: validate_date(end)
        status=data.get("status","active")
        if status not in {"active","paused","completed"}: raise ValueError("Invalid medication status.")
        with get_connection() as conn:
            cur=conn.execute("INSERT INTO medications (user_id,name,dosage_label,schedule,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)",(DEFAULT_USER_ID,name,dosage,schedule,start,end,status)); row=conn.execute("SELECT * FROM medications WHERE id=?",(cur.lastrowid,)).fetchone()
        return jsonify(dict(row)),201
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't save that medication.",500)


@app.patch("/api/medications/<int:item_id>")
def update_medication(item_id):
    try:
        data=body(); existing=one("SELECT * FROM medications WHERE id=? AND user_id=?",(item_id,DEFAULT_USER_ID))
        if not existing:return error("Medication not found.",404)
        allowed={"name","dosage_label","schedule","start_date","end_date","status"}; updates={k:data[k] for k in allowed if k in data}
        for k in ("name","dosage_label","schedule"):
            if k in updates: updates[k]=require_text({k:updates[k]},k)
        if "start_date" in updates:validate_date(updates["start_date"])
        if "end_date" in updates and updates["end_date"]:validate_date(updates["end_date"])
        if "status" in updates and updates["status"] not in {"active","paused","completed"}:raise ValueError("Invalid medication status.")
        if not updates:return error("No changes supplied.")
        assignments=", ".join(f"{k}=?" for k in updates)
        with get_connection() as conn:
            conn.execute(f"UPDATE medications SET {assignments} WHERE id=? AND user_id=?",(*updates.values(),item_id,DEFAULT_USER_ID)); row=conn.execute("SELECT * FROM medications WHERE id=?",(item_id,)).fetchone()
        return jsonify(dict(row))
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't update that medication.",500)


@app.delete("/api/medications/<int:item_id>")
def delete_medication(item_id): return delete_record("medications",item_id,"Medication")


@app.get("/api/reminders")
def get_reminders():return jsonify(rows("SELECT * FROM reminders WHERE user_id=? ORDER BY completed,date,time",(DEFAULT_USER_ID,)))


@app.post("/api/reminders")
def create_reminder():
    try:
        data=body(); title=require_text(data,"title"); dt=require_text(data,"date",10);validate_date(dt);tm=require_text(data,"time",5);validate_time(tm)
        with get_connection() as conn:
            cur=conn.execute("INSERT INTO reminders (user_id,title,date,time,completed) VALUES (?,?,?,?,0)",(DEFAULT_USER_ID,title,dt,tm));row=conn.execute("SELECT * FROM reminders WHERE id=?",(cur.lastrowid,)).fetchone()
        return jsonify(dict(row)),201
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't save that reminder.",500)


@app.patch("/api/reminders/<int:item_id>")
def update_reminder(item_id):
    try:
        data=body(); existing=one("SELECT * FROM reminders WHERE id=? AND user_id=?",(item_id,DEFAULT_USER_ID))
        if not existing:return error("Reminder not found.",404)
        updates={k:data[k] for k in ("title","date","time","completed") if k in data}
        if "title" in updates:updates["title"]=require_text(updates,"title")
        if "date" in updates:validate_date(updates["date"])
        if "time" in updates:validate_time(updates["time"])
        if "completed" in updates:updates["completed"]=1 if bool(updates["completed"]) else 0
        if not updates:return error("No changes supplied.")
        assignments=", ".join(f"{k}=?" for k in updates)
        with get_connection() as conn:
            conn.execute(f"UPDATE reminders SET {assignments} WHERE id=? AND user_id=?",(*updates.values(),item_id,DEFAULT_USER_ID));row=conn.execute("SELECT * FROM reminders WHERE id=?",(item_id,)).fetchone()
        return jsonify(dict(row))
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't update that reminder.",500)


@app.delete("/api/reminders/<int:item_id>")
def delete_reminder(item_id):return delete_record("reminders",item_id,"Reminder")


@app.get("/api/health-events")
def get_events():return jsonify(rows("SELECT * FROM health_events WHERE user_id=? ORDER BY date DESC,id DESC",(DEFAULT_USER_ID,)))


@app.post("/api/health-events")
def create_event():
    try:
        data=body();title=require_text(data,"title");dt=require_text(data,"date",10);validate_date(dt);category=require_text(data,"category",80);description=str(data.get("description","")).strip()[:1000]
        with get_connection() as conn:
            cur=conn.execute("INSERT INTO health_events (user_id,title,date,category,description) VALUES (?,?,?,?,?)",(DEFAULT_USER_ID,title,dt,category,description));row=conn.execute("SELECT * FROM health_events WHERE id=?",(cur.lastrowid,)).fetchone()
        return jsonify(dict(row)),201
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't save that health event.",500)


@app.delete("/api/health-events/<int:item_id>")
def delete_event(item_id):return delete_record("health_events",item_id,"Health event")


@app.get("/api/health-notes")
def get_notes():return jsonify(rows("SELECT * FROM health_notes WHERE user_id=? ORDER BY created_at DESC,id DESC",(DEFAULT_USER_ID,)))


@app.post("/api/health-notes")
def create_note():
    try:
        data=body();title=require_text(data,"title");content=require_text(data,"content",4000)
        with get_connection() as conn:
            cur=conn.execute("INSERT INTO health_notes (user_id,title,content) VALUES (?,?,?)",(DEFAULT_USER_ID,title,content));row=conn.execute("SELECT * FROM health_notes WHERE id=?",(cur.lastrowid,)).fetchone()
        return jsonify(dict(row)),201
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't save that note.",500)


@app.patch("/api/health-notes/<int:item_id>")
def update_note(item_id):
    try:
        data=body();existing=one("SELECT * FROM health_notes WHERE id=? AND user_id=?",(item_id,DEFAULT_USER_ID))
        if not existing:return error("Health note not found.",404)
        title=require_text(data,"title") if "title" in data else existing["title"];content=require_text(data,"content",4000) if "content" in data else existing["content"]
        with get_connection() as conn:
            conn.execute("UPDATE health_notes SET title=?,content=? WHERE id=? AND user_id=?",(title,content,item_id,DEFAULT_USER_ID));row=conn.execute("SELECT * FROM health_notes WHERE id=?",(item_id,)).fetchone()
        return jsonify(dict(row))
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't update that note.",500)


@app.delete("/api/health-notes/<int:item_id>")
def delete_note(item_id):return delete_record("health_notes",item_id,"Health note")


@app.post("/api/feedback")
def create_feedback():
    try:
        data=body();message=require_text(data,"message",1000)
        with get_connection() as conn:conn.execute("INSERT INTO feedback (user_id,message) VALUES (?,?)",(DEFAULT_USER_ID,message))
        return jsonify({"message":"Thanks for the feedback."}),201
    except ValueError as exc:return error(str(exc))
    except sqlite3.Error:return error("We couldn't send your feedback.",500)


def delete_record(table,item_id,label):
    if table not in {"appointments","medications","reminders","health_events","health_notes"}:return error("Invalid resource.",400)
    try:
        with get_connection() as conn:
            cur=conn.execute(f"DELETE FROM {table} WHERE id=? AND user_id=?",(item_id,DEFAULT_USER_ID))
            if cur.rowcount==0:return error(f"{label} not found.",404)
        return jsonify({"message":f"{label} deleted."})
    except sqlite3.Error:return error(f"We couldn't delete that {label.lower()}.",500)


@app.errorhandler(404)
def not_found(_):return error("The requested resource was not found.",404)

@app.errorhandler(405)
def method_not_allowed(_):return error("That action is not supported here.",405)

@app.errorhandler(500)
def server_error(_):return error("Something went wrong on the server.",500)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
