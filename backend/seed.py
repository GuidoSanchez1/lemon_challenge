from app.database import SessionLocal, create_db_and_tables
from app.models import User, Task
from app.auth import get_password_hash
from datetime import datetime

# Crear DB y sesión
create_db_and_tables()
db = SessionLocal()

# Usuario de prueba
email = "test@example.com"
password = "123456"
hashed = get_password_hash(password)

user = User(email=email, hashed_password=hashed)
db.add(user)
db.commit()
db.refresh(user)

# Tareas de ejemplo
tasks = [
    Task(title="Primera tarea", description="Tarea pendiente", owner_id=user.id),
    Task(title="Tarea completada", description="Hecha ayer", completed=True, completed_at=datetime.now(), owner_id=user.id),
    Task(title="Tarea eliminada", description="Ya no se usa", is_deleted=True, deleted_at=datetime.now(), owner_id=user.id)
]

db.add_all(tasks)
db.commit()

print(f"Usuario creado: {email} / {password}")
print("Tareas de ejemplo creadas.")