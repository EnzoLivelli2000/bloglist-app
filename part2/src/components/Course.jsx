const Course = ({ course }) => {
  console.log(
    "course -> ",
    course.parts.map((x) => x.name)
  );
  const total = course.parts.reduce((s, p) => s + p.exercises,0)
  return (
    <div>
      <p>{course.name}</p>
      {course.parts.map((m) => <li>{m.name} {m.exercises}</li>)}
      <p>Total is {total}</p>
    </div>
  );
};
export default Course;
