from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db import Base
import enum

class UserRole(enum.Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    password = Column(String(500), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")