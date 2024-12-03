from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from services.taskServ import create_task, TaskCreate, UpdateTask,edit_task, setTaskIsDone, deleteTask, deleteMultiple, getUserTasks, getAllStats
from db import db_dependency
from routes.userRoute import user_dependency
from typing import List, Dict

router = APIRouter()


@router.post("/tasks/", status_code=status.HTTP_201_CREATED)
async def create_new_task(task: TaskCreate, db: db_dependency, user:user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    return create_task(db=db, task=task)

@router.put("/task/{id}/edit", status_code=status.HTTP_201_CREATED)
async def editTask(id:int, task: UpdateTask, db: db_dependency, user:user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    task = edit_task(newTask=task, id=id, db=db)
    return {
        "userId": task.userId,
        "task": task.task,
        "description": task.description,
        "isDone": task.isDone,
        "isEdited": task.isEdited
    }

@router.put("/task/{id}/isDone", status_code=status.HTTP_201_CREATED)
async def taskIsDone(id: int, task_data: UpdateTask, db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    task = setTaskIsDone(isDone=task_data.isDone, id=id, db=db)
    return {
        "userId": task.userId,
        "task": task.task,
        "description": task.description,
        "isDone": task.isDone,
        "isEdited": task.isEdited
    }

@router.delete("/task/{id}/delete", status_code=status.HTTP_201_CREATED)
async def deleteTaskk(id:int, db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    deleted = deleteTask(id=id, db=db)
    if(deleted):
        return {"message": "deleted"}
    else:
        raise HTTPException(status_code=400, detail="not deleted")
    
@router.put("/tasks/delete", status_code=status.HTTP_201_CREATED)
async def deleteTasks(ids: List[int], db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    deleted = deleteMultiple(db=db, ids=ids)
    return {"deleted": "deleted"}

@router.get("/allTasks", status_code=status.HTTP_201_CREATED)
async def getTasks(db: db_dependency, user:user_dependency, userId: int = Query(...)):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    return getUserTasks(idUser=userId, db=db)

@router.get("/stats", status_code=status.HTTP_201_CREATED)
async def getStats(db: db_dependency, user:user_dependency):
    if user is None:
        raise HTTPException(status_code=400, detail="token required")
    stats = getAllStats(db=db)
    return {"all": stats.totalNum, "edited": stats.EditedNum, "deleted": stats.deletedNum}