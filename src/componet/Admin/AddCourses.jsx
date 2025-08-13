import { useEffect } from "react";
import FormCourses from "../Shared/FormCourses";

const AddCourses = () => {
  useEffect(() => {
    document.title = " إضافة كورس"; // Set the desired title for this page

    return () => {
      document.title = "مستر أحمد جابر"; // Reset the title when the component unmounts
    };
  }, []);
  return (
    <>
      <FormCourses title={"اضافة وحدة"}/>
    </>
  );
};

export default AddCourses;
