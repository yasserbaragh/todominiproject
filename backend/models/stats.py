from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db import Base

class Stats(Base):
    __tablename__ = "stats"

    id = Column(Integer, primary_key=True, index=True)
    EditedNum = Column(Integer, nullable=False)
    deletedNum = Column(Integer, nullable=False)
    totalNum = Column(Integer, nullable=False)