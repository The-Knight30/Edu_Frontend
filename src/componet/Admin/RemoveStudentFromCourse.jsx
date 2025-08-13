import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { BASEURL, REMOVESTUDENFROMCOURSE } from "../API/API";
import { useParams } from "react-router-dom";
import sendRequest from "../Shared/sendRequest";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";

function RemoveStudentFromCourse() {
    const { courseId } = useParams(); // Retrieve the course ID from the URL
    const { isDarkMode } = useContext(ThemeContext);
    const [emailStudent, setEmailStudentt] = useState();
    const [isLoading, setIsLoading] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const body = {
                email: emailStudent,
                courseId,
            };
            const res = await sendRequest(BASEURL, REMOVESTUDENFROMCOURSE, "DELETE", body);
            if (res.status === 200) {
                toast.success("تم حذف الطالب بنجاح")
            }
        }
        catch (error) {
            console.error("Error adding student to course:", error);
            toast.error("الرجاء التأكد من البريد الإلكتروني")
        }
        finally {
            setIsLoading(false); // Stop loading
        }

    };

    useEffect(() => {
        document.title = " حذف الكورس من الطالب";
        return () => {
            document.title = "Default Title";
        };
    }, []);

    return (
        <>
            <SpinnerModal isLoading={isLoading} />
            <div className={`mt-0 lg:pt-4   ${isDarkMode ? "bg-neutral-900" : ""}`}>
                <div
                    className={`text-right text-[20px] font-medium leading-normal mb-2 ${isDarkMode ? "text-white" : "text-black"
                        }`}
                >
                    حذف الطالب من الكورس
                </div>
            </div>
            <form onSubmit={handleSubmit} className="my-3 text-right m-4 md:m-0">
                <div className="">
                    <label
                        htmlFor="emailStudent"
                        className={`flex justify-end my-4 ${isDarkMode ? "text-white" : "text-black"
                            }`}
                    >
                        البريد الألكتروني
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                            />
                        </svg>
                    </label>
                    <input
                        type="email"
                        id="emailStudent"
                        placeholder="ادخل بريد الطالب "
                        className={`rounded-lg p-2 bg-gray-400 placeholder:text-white   border-none  w-full lg:w-3/4
                         text-right outline-none  ${isDarkMode ? "" : ""}`}
                        value={emailStudent}
                        onChange={(e) => setEmailStudentt(e.target.value)}
                        required
                    />
                </div>
                <div className=" mt-6  md:mb-0 ">
                    <div className="text-right ">
                        <button
                            className={` rounded-[9px] shadow-xl px-4 lg:px-20 py-2 text-white hover:border-amber-400  hover:bg-white transition duration-700  hover:text-black ${isDarkMode ? "bg-sky-400" : "bg-gray-800"
                                }`}
                        >
                            حذف الطالب
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default RemoveStudentFromCourse;
