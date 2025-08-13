import { useEffect } from 'react'
import CommonNavbar from '../Shared/CommonNavbar'

function UnitContent() {

  useEffect(() => {
    document.title = "محتوي الكورس"; // Set the desired title for this page

    return () => {
      document.title = "مستر أحمد جابر"; // Reset the title when the component unmounts
    };
  }, []);
  return (
      <>
      <CommonNavbar/>
      </>
  )
}

export default UnitContent
