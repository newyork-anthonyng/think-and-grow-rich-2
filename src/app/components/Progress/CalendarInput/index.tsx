"use client";
import React, { useState } from "react";
import Calendar, { TileArgs } from "react-calendar";
import { isSameDay } from "date-fns";
import "react-calendar/dist/Calendar.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMachine } from "@xstate/react";
import machine from "./machine";

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
    return (
      <span className="absolute w-2 h-2 rounded-full bg-green-500" />
    );
  }

  return null;
}

function CalendarInput() {
  const [state, send] = useMachine(machine);
  const [open, setOpen] = useState(false);

  const handleClickDay = (date: Date) => {
    setOpen(true);
  };

  if (state.matches('pending')) {
    return null;
  }

  return (
    <>
      <Calendar
        value={state.context.date}
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
