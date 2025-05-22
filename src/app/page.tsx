import DesireWallContainer from "@/app/components/DesireWall";
import Progress from "@/app/components/Progress";
import CalendarInput from "@/app/components/Progress/CalendarInput";

export default function Home() {
  return (
    <div>
      <DesireWallContainer />
      <div className="w-1/2">
        <Progress />
        <CalendarInput />
      </div>
    </div>
  );
}
