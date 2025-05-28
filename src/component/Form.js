import React, { useState } from 'react';
import Loader from './Loader';

const Form = () => {

    const [input,setInput] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = { name: input, email, password };

        if(formData.name === '' || formData.email === '' || formData.password === ''){
          alert("Enter all the fields");
          return;
        }

         setIsSubmitting(true);
         setErrorMessage('');  
         setSuccessMessage('');

        try {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (!res.ok) {
            throw new Error("Something went wrong while submitting the form.");
          }

           await res.json();

          localStorage.setItem('formData', JSON.stringify(formData));
          console.log(JSON.parse(localStorage.getItem('formData')));

          setInput('');
          setEmail('');
          setPassword('');

          setSuccessMessage('success');

        } catch (err) {
          setErrorMessage('Failed to submit form. Please try again later.');
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Demo Form</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input}
                    onChange={(e) => setInput(e.target.value)} placeholder='Enter your name'/>
                <br /> <br />

                <input type="email" value={email} 
                    onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your Email'/>
                <br /> <br />

                <input type="password" value={password} 
                    onChange={(e)=> setPassword(e.target.value)} 
                    placeholder='Enter your password'/>
                <br /> <br />

                <button
                    disabled={isSubmitting || !input || !email || !password}
                    type="submit"
                >
                    {isSubmitting ? <Loader /> : 'Submit'}
                </button>

                {successMessage && <span role="alert">{successMessage}</span>}
                 {errorMessage && <span role="alert">{errorMessage}</span>}
            </form>
        </div>
    )
}

export default Form;
