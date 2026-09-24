import math
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[chr(42)],
    allow_methods=[chr(42)],
    allow_headers=[chr(42)],
)


class CalculateRequest(BaseModel):
    a: float
    b: float = 0
    op: str


class CalculateResponse(BaseModel):
    result: float
    expression: str


@app.get(chr(47) + chr(97) + chr(112) + chr(105) + chr(47) + chr(104) + chr(101) + chr(97) + chr(108) + chr(116) + chr(104))
def health():
    return dict(status=chr(111) + chr(107))


@app.post(chr(47) + chr(97) + chr(112) + chr(105) + chr(47) + chr(99) + chr(97) + chr(108) + chr(99) + chr(117) + chr(108) + chr(97) + chr(116) + chr(101), response_model=CalculateResponse)
def calculate(req: CalculateRequest):
    a = req.a
    b = req.b
    op = req.op
    if op == chr(97) + chr(100) + chr(100):
        return CalculateResponse(result=a + b, expression=str(a) + chr(32) + chr(43) + chr(32) + str(b))
    if op == chr(115) + chr(117) + chr(98):
        return CalculateResponse(result=a - b, expression=str(a) + chr(32) + chr(45) + chr(32) + str(b))
    if op == chr(109) + chr(117) + chr(108):
        return CalculateResponse(result=a * b, expression=str(a) + chr(32) + chr(120) + chr(32) + str(b))
    if op == chr(100) + chr(105) + chr(118):
        if b == 0:
            raise HTTPException(status_code=400, detail=chr(68) + chr(105) + chr(118) + chr(105) + chr(115) + chr(105) + chr(111) + chr(110) + chr(32) + chr(98) + chr(121) + chr(32) + chr(122) + chr(101) + chr(114) + chr(111))
        return CalculateResponse(result=a / b, expression=str(a) + chr(32) + chr(47) + chr(32) + str(b))
    if op == chr(112) + chr(111) + chr(119):
        return CalculateResponse(result=pow(a, b), expression=str(a) + chr(32) + chr(94) + chr(32) + str(b))
    if op == chr(112) + chr(101) + chr(114) + chr(99) + chr(101) + chr(110) + chr(116):
        return CalculateResponse(result=(a / 100) * b, expression=str(a) + chr(37) + chr(32) + chr(111) + chr(102) + chr(32) + str(b))
    if op == chr(115) + chr(113) + chr(114) + chr(116):
        if a < 0:
            raise HTTPException(status_code=400, detail=chr(78) + chr(101) + chr(103) + chr(97) + chr(116) + chr(105) + chr(118) + chr(101))
        return CalculateResponse(result=math.sqrt(a), expression=chr(115) + chr(113) + chr(114) + chr(116) + chr(40) + str(a) + chr(41))
    raise HTTPException(status_code=400, detail=chr(85) + chr(110) + chr(107) + chr(110) + chr(111) + chr(119) + chr(110))
