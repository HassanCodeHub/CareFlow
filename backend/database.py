from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_connection() as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        user = conn.execute("SELECT id FROM users WHERE id = 1").fetchone()
        if not user:
            conn.execute(
                "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
                (1, "Aarav", "demo@careflow.local"),
            )
        count = conn.execute("SELECT COUNT(*) AS count FROM appointments WHERE user_id = 1").fetchone()["count"]
        if count == 0:
            conn.executemany(
                "INSERT INTO appointments (user_id,title,doctor_name,date,time,location,status) VALUES (?,?,?,?,?,?,?)",
                [
                    (1, "General consultation", "Dr. Arun", "2026-09-11", "10:30", "City Health Clinic", "upcoming"),
                    (1, "Routine follow-up", "Dr. Meera", "2026-09-14", "16:00", "CarePoint Medical Centre", "upcoming"),
                    (1, "Annual review", "Dr. Kavya", "2026-08-22", "11:00", "Wellness Clinic", "completed"),
                ],
            )
            conn.executemany(
                "INSERT INTO medications (user_id,name,dosage_label,schedule,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)",
                [
                    (1, "Vitamin D", "User-entered label", "08:00 AM", "2026-09-01", None, "active"),
                    (1, "Daily tablet", "As recorded", "08:00 PM", "2026-09-05", None, "active"),
                ],
            )
            conn.executemany(
                "INSERT INTO health_events (user_id,title,date,category,description) VALUES (?,?,?,?,?)",
                [
                    (1, "Blood test added", "2026-09-10", "Health event", "Personal record added to the timeline."),
                    (1, "Routine review", "2026-08-22", "Appointment", "Completed appointment recorded by the user."),
                    (1, "Follow-up planned", "2026-08-18", "Reminder", "A follow-up task was added."),
                ],
            )
            conn.executemany(
                "INSERT INTO reminders (user_id,title,date,time,completed) VALUES (?,?,?,?,?)",
                [
                    (1, "Follow-up appointment", "2026-09-12", "09:00", 0),
                    (1, "Bring questions to next visit", "2026-09-14", "15:30", 0),
                    (1, "Review old health note", "2026-09-08", "18:00", 1),
                ],
            )
            conn.executemany(
                "INSERT INTO health_notes (user_id,title,content) VALUES (?,?,?)",
                [
                    (1, "Questions for next appointment", "Ask about the follow-up plan and note any instructions provided during the visit."),
                    (1, "Personal health log", "Use this space for information I want to remember and discuss with my healthcare professional."),
                ],
            )


def row_dict(row):
    return dict(row) if row else None
