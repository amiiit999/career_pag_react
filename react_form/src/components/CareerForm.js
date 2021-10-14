import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from 'react-hook-form';

const API_PATH = 'http://localhost/Mr_amiit/cubedotsProjects/reactForm/submitform/index.php';



// const SignupSchema = yup.object().shape({
//   name: yup.string().required(),
// });

function CareerForm() {
  //const [content, setContent] = React.useState("");
  const [file, setSelectedFile] = React.useState("");
  const imageInputRef = React.useRef("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
 
  const { formState: { errors } } = useForm();
 
 
  useEffect(() => {
    loadList();
  }, []);
 
  const loadList = async () => {
    // const result = await axios.get("http://localhost:8000/api/list");
    // setLoadImage(result.data.reverse());
  };
 
 
  const handleSubmit  = async (e) => {
    e.preventDefault();
  
    //setContent(""); //Resets the value of the first input - See #1

    //////START of File Input Reset
    imageInputRef.current.value = "";//Resets the file name of the file input - See #2
    setSelectedFile(null); 
    const formData = new FormData();
    
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);
    formData.append("file", file);

    await axios.post(API_PATH,formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }) // 4
       .then(response => {
       
      if(response.data.sent === true){
        setName('')
        setEmail('')
        setPhonenumber('')
        setSelectedFile('')
        
        alert(response.data.message)
      }
      else if(response.data.email_sent === false){
       
        setEmail('')
        
        alert(response.data.message)
      }
      else if(response.data.phone_sent === false){
        setPhonenumber('')
        alert(response.data.message)
      }
      else{
        // setName('')
        // setEmail('')
        // setPhonenumber('')
        setSelectedFile('')
        alert(response.data.message)
      }
      
       }
      ) // 5
       .catch(errors => { console.log(errors) })
  };
 

  return (
    <div className="container mt-5">
      
      <div className="row">
        <div className="col-sm-6 m-auto bg-gray">
         <div className="card">
           <div className="card-header bg-info"><h5 className="text-center text-light">Career</h5></div>
          <div className="card-body text-start">
          
          <form onSubmit={handleSubmit}>
         
              <div className="form-group">
                <label>Full Name</label>

                <input type="text" name="name" className="form-control rounded-0" onChange={(e) => setName(e.target.value)} placeholder="Full Name" value={name || ''} required/>
                {errors.name && <p>{errors.name.message}</p>}
              </div>
            
 
           
             <div className="form-group mt-2">
             <label>Email</label>

              <input type="text" name="email"  className="form-control rounded-0" onChange={(e) => setEmail(e.target.value)} placeholder="Email" value={email || ''} required />
             
             </div>
           
             <div className="form-group mt-2">
             <label>Contact no.</label>

              <input type="text" name="phonenumber" className="form-control rounded-0" onChange={(e) => setPhonenumber(e.target.value)} placeholder="Contact no." value={phonenumber || ''} required />
             </div>
           
             <div className="form-group mt-2">
             <label>Upload CV</label>
              <input type="file" name="file" className="form-control rounded-0" onChange={(e) => setSelectedFile(e.target.files[0])} ref={imageInputRef}  required />
             </div>
            
 
           
             <div className="form-group mt-2">
               <button type="submit" className="btn btn-success" name="submit">
                 Submit
              </button>
             </div>
           
          </form>
          </div>
          </div>
        </div>
    
      </div>
    </div>
  );
}
export default CareerForm;