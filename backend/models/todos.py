from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from db import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    isDone = Column(Boolean, default=False)
    isEdited = Column(Boolean, default=False)

    user = relationship("User", back_populates="tasks")