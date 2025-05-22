import DesireWallContainer from "@/app/components/DesireWall";
import Progress from "@/app/components/Progress";

export default function Home() {
  return (
    <div>
      <DesireWallContainer />
      <div className="w-1/2">
        <Progress />
      </div>
    </div>
  );
}
