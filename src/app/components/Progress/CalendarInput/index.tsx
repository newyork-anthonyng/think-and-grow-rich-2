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
import { PendingProgress, Progress } from "@/lib/types";
import { Button } from "@/components/ui/button";

function tileContentFactory(progressEntries: (Progress | PendingProgress)[]) {
  const datesToAddClassTo = [...progressEntries]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => entry.date);

  const TileContent = ({ date, view }: TileArgs) => {
    if (view !== "month") return null;

    const shouldAddDecoration = datesToAddClassTo.find((dDate) =>
      isSameDay(dDate, date)
    );
    if (shouldAddDecoration) {
      return <span className="absolute w-1 h-1 rounded-full bg-green-600" />;
    }

    return null;
  };
  
  TileContent.displayName = "TileContent";
  return TileContent;
}

interface CalendarInputProps {
  progressEntries: Progress[];
  onProgressEntriesChange: (progressEntries: (Progress | PendingProgress)[]) => void;
}

function CalendarInput({
  progressEntries,
  onProgressEntriesChange,
}: CalendarInputProps) {
  const [state, send] = useMachine(
    machine.provide({
      actions: {
        onProgressEntriesChange: ({ context }) => {
          onProgressEntriesChange(context.progressEntries);
        },
      },
    }),
    {
      input: {
        data: progressEntries,
      },
    }
  );

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

  function handleChangeNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const number = parseInt(e.target.value);
    send({ type: "CHANGE_NUMBER_INPUT", data: number });
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
          <Input
            type="number"
            value={state.context.numberInput ?? ""}
            onChange={handleChangeNumberInput}
          />
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarInput;
