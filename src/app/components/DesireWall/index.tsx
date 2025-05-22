"use client";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useMachine } from "@xstate/react";
import machine from "./machine";

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
      <div>
        <MarkdownEditor.Markdown source={state.context.markdown} />
        <button onClick={handleEditClick}>Edit</button>
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
    <div>
      DesireWall
      <div>
        <MarkdownEditor
          height="600px"
          value={state.context.markdown}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
}

export default DesireWallContainer;
