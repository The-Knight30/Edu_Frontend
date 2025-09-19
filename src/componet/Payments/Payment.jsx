import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function Payment() {
  const phoneNumber = '+201143915234';

  const { coursePrice, courseName } = useParams();
  useEffect(() => {
    document.title = "صفحة الدفع";
    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);
  return (
    <>
      <Link
      onClick={_=>window.history.back()}
        
        className="flex px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 transition duration-700 absolute top-8 left-20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </Link>
      <div className="flex flex-col justify-center items-center mt-20">
        <h2 className="mb-10 mt-5 text-center">
          برجاء التوجه الي أقرب فرع او مندوب والدفع عن طريق فودافون كاش
        </h2>
        <h2 className="px-20 py-5 lg:px-32 lg:py-8  rounded-lg border border-amber-400 text-lg lg:text-3xl">
          01024305685
        </h2>
        <Link className="my-2 text-center font-bold leading-normal text-sky-400  hover:text-sky-500 " to={`https://wa.me/${phoneNumber}`} target="_blank" >
          للتواصل لتفعيل الكورس 
        </Link>
        
        <div className="overflow-x-auto my-10 rounded-xl max-w-4xl">
          <table className="w-full text-gray-500 text-center shadow-lg">
            <thead className="bg-amber-400 text-neutral-800 uppercase">
              <tr>
                <th className="px-10 lg:px-20 py-6">السعر</th>
                <th className="px-10 lg:px-20 py-6">اسم الكورس</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border-b">
                <td className="px-5 sm:px-10 py-4">{coursePrice}</td>
                <td className="px-5 sm:px-10 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {courseName}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 className=" text-center py-5 px-2 m-2 rounded-lg border bg-amber-400 text-lg">
          عند الدفع الدفع يرجي التواصل مع الدعم لتفعيل الكورس مع العلم انه يجب انتظار
          بعض الوقت لحين تفعيل الكورس
        </h2>
      </div>
    </>
  );
}

export default Payment;
