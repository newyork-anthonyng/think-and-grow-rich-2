"use client";
import React, { useState } from "react";
import Calendar, { TileArgs } from "react-calendar";
import { isSameDay } from "date-fns";
import { Value } from "react-calendar/src/shared/types.js";
import "react-calendar/dist/Calendar.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [open, setOpen] = useState(false);
  // const [open, setOpen] = useState(true);

  const onChange = (date: Value) => {
    setValue(date);
  };

  const handleClickDay = (date: Date) => {
    console.log(date);
    setOpen(true);
  };


  return (
    <>
      <Calendar
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        onClickDay={handleClickDay}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarInput;
