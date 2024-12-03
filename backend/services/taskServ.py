from sqlalchemy.orm import Session
from models.todos import Task
from models.stats import Stats
from pydantic import BaseModel
from typing import Optional, List

class TaskCreate(BaseModel):
    userId: int
    task: str
    description: str
    isDone: bool
    isEdited: bool

class UpdateTask(BaseModel):
    userId: Optional[int]= None
    task: Optional[str] = None
    description: Optional[str] = None
    isDone: Optional[bool] = None
    isEdited: Optional[bool] = None

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.dict())  
    db.add(db_task)
    stat = db.query(Stats).filter(Stats.id == 1).first()
    stat.totalNum += 1
    db.commit()
    db.refresh(db_task)
    return db_task

def edit_task(db: Session, id:int, newTask: UpdateTask):
    task = db.query(Task).filter(Task.id == id).first() 
    stat = db.query(Stats).filter(Stats.id == 1).first()

    if task is None:
        raise ValueError(f"Task with id {id} not found")

    edited = False

    if newTask.task is not None:
        task.task = newTask.task
        edited = True

    if newTask.description is not None:
        task.description = newTask.description
        edited = True

    if newTask.isDone is not None:
        task.isDone = newTask.isDone
        edited = True

    if newTask.isEdited is not None:
        task.isEdited = newTask.isEdited
        edited = True

    if edited:
        task.isEdited = True
        stat.EditedNum += 1


    db.commit()
    db.refresh(task)

    return task
    

def setTaskIsDone(db: Session, id: int, isDone: bool):
    task = db.query(Task).filter(Task.id == id).first()
    if task is None:
        return None 

    task.isDone = isDone

    db.commit()
    db.refresh(task)

    return task

def deleteTask(db: Session, id: int):
    task = db.query(Task).filter(Task.id == id).first()
    stat = db.query(Stats).filter(Stats.id == 1).first()

    if task is None:
        raise ValueError(f"Task with id {id} not found")
    
    if(task.isEdited):
        stat.EditedNum -= 1

    db.delete(task)
    stat.deletedNum += 1
    stat.totalNum -= 1
    db.commit()
    return True


def deleteMultiple(db: Session, ids: List[int]):
    try:
        for id in ids:
            task = db.query(Task).filter(Task.id == id).first()
            stat = db.query(Stats).filter(Stats.id == 1).first()

            if task is None:
                raise ValueError(f"Task with id {id} not found")

            db.delete(task)
            stat.deletedNum += 1
            stat.totalNum -= 1
            db.commit()
            return True
    except:
        raise ValueError(f"not deleted")

def find_task_byId(db: Session, id: int) -> TaskCreate:
    return db.query(Task).filter(Task.id == id).first()

def getUserTasks(db: Session, idUser:int):
    return db.query(Task).filter(Task.userId == idUser).all()

def getAllStats(db: Session):
    return db.query(Stats).filter(Stats.id == 1).first()
