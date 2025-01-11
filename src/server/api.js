export const groupedQuestions = [
  { 
    id : "Company Information",
    title : "Let's get started with a little information about the parties. First, who is the landlord?",
    questions: [
      {id: "company_name", question: "Company name (leave blank if landlord is an individual)", type:"text"},
      {id: "landlord_name", question: "Landlord or Representative's name", type:"text"},
      {id: "address", question: "Address", type:"text"},
      {id: "city", question: "City", type:"text"},
      {id: "state", question: "State", type:"text"},
      {id: "zip_code", question: "ZIP Code", type:"number"},
      {id: "phone_number", question: "Phone number", type:"text"},
      {id: "email", question: "Email", type:"email"},
    ]
  },
  {
    id: "Tenant?",
    title : "Who is the tenant?",
    questions: [
      {id:'tenant', question: "Tenant's full name",type: "text"}
    ]
  },
  {
    id: 'terms_agreement',
    title: 'Agreement Section',
    questions: [
        {id: 'agree_terms',question: 'Do you agree with the terms?',type: 'radio',options: ['Yes', 'No']},
        {id: 'why_disagree',question: 'Why do you disagree?',type: 'text',condition: (data) => data.agree_terms === 'No'}
    ]
}
];