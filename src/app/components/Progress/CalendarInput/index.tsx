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
import { Progress } from "@/lib/types";
import { Button } from "@/components/ui/button";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const in2Days = new Date(today);
in2Days.setDate(today.getDate() + 2);

const in3Days = new Date(today);
in3Days.setDate(today.getDate() + 3);

const in4Days = new Date(today);
in4Days.setDate(today.getDate() + 4);

function tileContentFactory(progressEntries: Progress[]) {
  const datesToAddClassTo = progressEntries.map((entry) => entry.date);

  return ({ date, view }: TileArgs) => {
    if (view !== "month") return null;

    const shouldAddDecoration = datesToAddClassTo.find((dDate) =>
      isSameDay(dDate, date)
    );
    if (shouldAddDecoration) {
      return <span className="absolute w-1 h-1 rounded-full bg-green-600" />;
    }

    return null;
  }
}


function CalendarInput() {
  const [state, send] = useMachine(machine, {
    input: {
      data: [
        {
          actual: 10,
          goal: 20,
          date: today
        },
        {
          actual: 50,
          goal: 40,
          date: tomorrow
        },
        {
          actual: 50,
          goal: 60,
          date: in2Days
        },
        {
          actual: 70,
          goal: 80,
          date: in3Days
        },
        {
          actual: 90,
          goal: 100,
          date: in4Days
        },
      ],
    },
  });

  const handleClickDay = (date: Date) => {
    send({ type: "OPEN", data: date });
  };

  function handleModalOpenChange(open: boolean) {
    if (!open) {
      send({ type: "CLOSE" });
    }
  }

  function handleSaveClick() {
    send({ type: "SAVE" });
  }

  if (state.matches("pending")) {
    return null;
  }

  return (
    <>
      <Calendar
        value={state.context.selectedDate}
        tileContent={tileContentFactory(state.context.progressEntries)}
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
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarInput;
