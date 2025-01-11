import { useState } from 'react'
import { groupedQuestions } from './server/api'

import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

function App() {
  const [step, setStep] = useState(0);
  const [showDownload, setShowDownload] = useState(false);
  const [formData, setFormData] = useState({});
  
  const handleChange =(id, value)=>{
    setFormData(prev => ({...prev, [id]: value}));
  };


  const renderInputs =(group)=>{
      return group.questions.map((q) => {
        if(q.condition && !q.condition(formData)) return null;

        return (
          <div key={q.id} style={{ marginBottom: '15px' }}>
            <label>{q.question}</label>
            {q.type === 'radio' ? (
              q.options.map((opt) =>(
                <label key={opt} style={{ marginLeft: '10px' }}>
                  <input
                      type='radio'
                      name={q.id}
                      value={opt}
                      checked={formData[q.id] === opt }
                      onChange={()=> handleChange(q.id, opt)} />
                      {opt}
                </label>
              ))
            ) : (
              <input
                  type={q.type}
                  name={q.id}
                  value={formData[q.id] || ''}
                  onChange={(e)=>{handleChange(q.id, e.target.value)}}
                  className='border border-gray-300 block w-[300px] rounded-md px-2 text-lg ms-1 mt-1' />
            )}
          </div>
        );

      });
  }

  const generatePdf = async (formData) => {
    const existPdfByte = await fetch('/form-data.pdf').then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existPdfByte);
    const form = pdfDoc.getForm();
    
    form.getTextField('txtName').setText(formData.landlord_name);
    form.getTextField('txtCompany').setText(formData.company_name);
    form.getTextField('txtTenant').setText(formData.tenant);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    saveAs(blob, 'newfile.pdf');
  }

  const nextStep = () =>{
    if(step < groupedQuestions.length -1){
      setStep(step+1)
    }else{
      setShowDownload(true);
      console.log('form data: '+ JSON.stringify(formData,null,2));
      
    }
  }

  const prevStep = ()=>{
    (step > 0) ? setStep(step-1) : setStep(step);
    setShowDownload(false);
  }

  return (
    <>
      <div className='w-[800px] p-4 bg-gray-300 my-10 border border-gray-400 mx-auto'>
        <h2 className='text-lg font-normal w-full border-b border-gray-300 pb-3  select-none'>Step {step+1} of { groupedQuestions.length }</h2>

        <h1 className="text-2xl py-5 font-bold mt-3 mb-2 text-gray-700 select-none">{ groupedQuestions[step].title }</h1>
        <div className='w-11/12 mx-auto bg-white rounded-lg border border-gray-400 py-3 px-3'>
          {renderInputs(groupedQuestions[step])}
        </div>
        <div className="w-11/12 mx-auto bg-white py-3 px-2 flex flex-row gap-1 mt-3 rounded-lg border border-gray-400">
          {
            step > 0 ? 
              <button className='bg-orange-600 text-white font-bold py-1 px-10 rounded-md' onClick={prevStep}>Previous</button> : ''
          }

          {
            !showDownload ?
              <button className={`${step === groupedQuestions.length -1 ? 'bg-green-600' : 'bg-orange-600'} text-white font-bold py-1 px-10 rounded-md`} onClick={nextStep}>{step == groupedQuestions.length -1 ? 'Finish' : 'Next'}</button>
              :
              ''
          }
          
          
          {
            showDownload ?
              <button className='bg-none text-blue-600' onClick={()=>{generatePdf(formData)}}>Click to Download</button> : ''
          }
        </div>
      </div>
    </>
  )
}

export default App
