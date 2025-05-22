"use client";
import React from "react";
import Calendar, { TileArgs } from "react-calendar";
import { isSameDay } from "date-fns";
import "react-calendar/dist/Calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMachine } from "@xstate/react";
import machine from "./machine";
import { Input } from "@/components/ui/input";

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

  const shouldAddDecoration = datesToAddClassTo.find((dDate) =>
    isSameDay(dDate, date)
  );
  if (shouldAddDecoration) {
    return <span className="absolute w-1 h-1 rounded-full bg-green-600" />;
  }

  return null;
}

function CalendarInput() {
  const [state, send] = useMachine(machine);

  const handleClickDay = (date: Date) => {
    send({ type: "OPEN", data: date });
  };

  function handleModalOpenChange(open: boolean) {
    if (!open) {
      send({ type: "CLOSE" });
    }
  }

  if (state.matches("pending")) {
    return null;
  }

  return (
    <>
      <Calendar
        value={state.context.selectedDate}
        tileContent={tileContent}
        onClickDay={handleClickDay}
      />
      <Dialog
        open={state.matches("idle.modal.opened")}
        onOpenChange={handleModalOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add entry for {state.context.selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <Input type="number" />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarInput;
