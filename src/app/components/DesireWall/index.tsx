"use client";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useMachine } from "@xstate/react";
import machine from "./machine";
import { Button } from "@/components/ui/button";

function DesireWallContainer() {
  return <DesireWall />;
}

function DesireWall() {
  const [state, send] = useMachine(machine);

  const isViewing = state.matches("viewing");
  const handleEditClick = () => {
    send({ type: "EDIT" });
  };

  if (isViewing) {
    return (
      <div className="flex gap-4">
        <div className="flex-3/4">
          <MarkdownEditor.Markdown source={state.context.markdown} />
        </div>
        <div>
          <Button onClick={handleEditClick}>Edit</Button>
        </div>
      </div>
    );
  }

  function handleChange(value: string) {
    send({ type: "CHANGE_MARKDOWN", data: value });
  }

  const handleSaveClick = () => {
    send({ type: "VIEW" });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <MarkdownEditor
          height="600px"
          value={state.context.markdown}
          onChange={handleChange}
        />
      </div>
      <Button onClick={handleSaveClick}>Save</Button>
    </div>
  );
}

export default DesireWallContainer;
