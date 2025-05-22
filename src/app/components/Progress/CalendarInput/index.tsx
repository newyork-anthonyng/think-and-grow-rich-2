"use client";
import React, { useState } from "react";
import Calendar, { TileArgs } from "react-calendar";
import { isSameDay } from "date-fns";
import { Value } from "react-calendar/src/shared/types.js";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const in3Days = new Date(today);
in3Days.setDate(today.getDate() + 3);

const in5Days = new Date(today);
in5Days.setDate(today.getDate() + 5);

const datesToAddClassTo = [tomorrow, in3Days, in5Days];

function tileContent({ date, view }: TileArgs) {
  if (view !== "month") return null;

  const shouldAddClass = datesToAddClassTo.find((dDate) =>
    isSameDay(dDate, date)
  );
  if (shouldAddClass) {
    return <span className="absolute text-xs text-red-500">Yo</span>;
  }

  return null;
}

function CalendarInput() {
  const [value, setValue] = useState<Value>(new Date());

  const onChange = (date: Value) => {
    setValue(date);
  };

  return (
    <Calendar onChange={onChange} value={value} tileContent={tileContent} />
  );
}

export default CalendarInput;
