import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./AnchorzUp.svg"
import { Formik, Field, Form, ErrorMessage } from "formik";
import *  as Yup from "yup";
 
function App() {

  const [responseData, setResponseData] = useState([]);

  const initialValues = {
    url: "",
    expiration: "1m",
  };

  const validationSchema = Yup.object({
    url: Yup.string().required("Url is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://localhost:3307/links", {
        url: data.url,
        expiration: data.expiration,
      })
      .then((response) => {
        console.log(response.data);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
      });
  };

 
  useEffect(() => {
    axios
      .get("http://localhost:3307/links")
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDeleteLink = (id) => {
    axios
      .delete(`http://localhost:3307/links/${id}`)
      .then((response) => {
        setResponseData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <div className="container mx-auto flex h-screen  ">
        <div className="left-part w-1/4 h-screen justify-center  items-center  bg-slate-100">
        <img src={logo} alt="AnchorzUp Logo" className="mx-auto mt-10"/> 
        <div className="flex flex-col items-center mt-5">
        <p className="font-bold mb-5 mr-5">My shortened URLs</p>
    <ul className="flex flex-col justify-between">
          {responseData.map((item) => (
      <li key={item.id} className="mb-2 flex items-center justify-between">
        <a href={`http://localhost:3307/links/${item.shortUrl}`} className="text-blue-500 hover:underline">
          {`http://${item.shortUrl}`}
        </a>
        <button onClick={() => handleDeleteLink(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer ml-10">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 24 24">
        <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
        </svg>
        </button>
      </li>
    ))}
  </ul>
</div>
        </div>

        <div className="right-part w-1/2 p-4 mt-10 ml-20">
          
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form classname="flex flex-col">
          <h2 className="text-2xl">URL SHORTENER</h2>
          <div className="flex">
            <div className="flex items-center w-1/2">
              <Field
                type="text"
                id="url"
                name="url"
                placeholder="Enter your URL"
                className="w-full p-2 rounded border"
              />
            </div>
            <ErrorMessage name="url" component="div" className="text-red-500" />

            <div className="flex items-center w-[200px] ml-10">
            
              <Field 
                as="select"
                id="expiration"
                name="expiration"
                className="w-full p-2  border rounded"
              >
                <option value="1m" className="custom-select-option">1 minute</option>
                <option value="2m" className="custom-select-option">2 minutes</option>
                <option value="5m" className="custom-select-option">5 minutes</option>
                <option value="1h" className="custom-select-option">1 hour</option>
                <option value="5h" className="custom-select-option">5 hours</option>
              </Field>
            </div>
            </div>
            <button type="submit"  className="w-48 mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
              Shorten Link
            </button>
          
        </Form>
        </Formik>
        </div>
      </div>
    </div>
  );
}

export default App;
