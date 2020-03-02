import React from 'react'

const InvoiceMyClients = () => {
  return (
    <section id="invoicemyclients" className="invoicemyclients">
      <h3>Attention! We're launching a new service!</h3>
      <p>Are you a freelancer who has trouble getting your clients to pay on time?</p>
      <p>Time and time again we have had to chase clients to pay outstanding invoices.</p>
      <p>We love our clients but we have to make ends meet.</p>
      <p className="margin large">
        We will soon launch a new service which will help our clients pay outstanding
        invoices in a timely manner, as well as help us, the freelancer, understand which
        invoices have been paid and what's outstanding.
      </p>
      <p>Did we mention that it's free?</p>
      <a className="btn btn-white" href="https://invoicemyclients.com/landing">
        Register your interest today
      </a>
      <small>P.S. sorry for the interruption!</small>
    </section>
  )
}

export { InvoiceMyClients }
