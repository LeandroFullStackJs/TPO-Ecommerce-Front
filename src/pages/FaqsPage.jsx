import { useState } from 'react'

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "¿Cómo puedo comprar una obra de arte?",
      answer: "Puedes navegar por nuestro catálogo, seleccionar la obra que te interese, elegir la cantidad y añadirla al carrito. Luego procede al checkout para completar tu compra. Necesitas estar registrado para realizar compras."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias y pagos en efectivo para entregas locales. Todos los pagos están protegidos con encriptación SSL."
    },
    {
      question: "¿Cómo funciona el envío de las obras?",
      answer: "Ofrecemos envío nacional e internacional. Las obras se embalan cuidadosamente con materiales de protección especializados. Los tiempos de entrega varían según la ubicación: 3-5 días laborables a nivel nacional y 7-15 días internacionalmente."
    },
    {
      question: "¿Puedo devolver una obra si no me gusta?",
      answer: "Sí, ofrecemos una política de devolución de 30 días. La obra debe estar en perfectas condiciones y en su embalaje original. Los gastos de envío de devolución corren por cuenta del comprador, excepto si hay algún defecto."
    },
    {
      question: "¿Cómo puedo vender mis obras en ArtGallery?",
      answer: "Puedes registrarte como artista, crear tu perfil y comenzar a subir tus obras. Cada obra debe incluir información detallada como dimensiones, técnica, año de creación y una descripción. Cobramos una comisión del 15% por cada venta."
    },
    {
      question: "¿Las obras son originales?",
      answer: "Sí, todas las obras en nuestra galería son piezas originales creadas por los artistas. Cada obra incluye un certificado de autenticidad y información detallada sobre el artista y la técnica utilizada."
    },
    {
      question: "¿Puedo ver las obras en persona antes de comprar?",
      answer: "Por el momento operamos exclusivamente online, pero estamos trabajando en abrir espacios físicos en el futuro. Todas nuestras fotos son de alta calidad y mostramos las obras desde diferentes ángulos."
    },
    {
      question: "¿Ofrecen asesoramiento para coleccionistas?",
      answer: "Sí, contamos con un equipo de expertos en arte que pueden asesorarte sobre inversiones artísticas, cuidado de obras y construcción de colecciones. Contáctanos para agendar una consulta gratuita."
    },
    {
      question: "¿Qué pasa si una obra llega dañada?",
      answer: "Si tu obra llega dañada, contáctanos inmediatamente con fotos del daño. Te enviaremos un reemplazo sin costo adicional o te reembolsaremos el dinero completo. Tu satisfacción es nuestra prioridad."
    },
    {
      question: "¿Puedo encargar una obra personalizada?",
      answer: "Muchos de nuestros artistas aceptan comisiones personalizadas. Puedes contactar directamente al artista a través de su perfil o escribirnos para que te ayudemos a conectar con el artista adecuado para tu proyecto."
    }
  ]

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faqs-page">
      <div className="section">
        <div className="section-header">
          <h1 className="section-title">Preguntas Frecuentes</h1>
          <p className="section-subtitle">
            Encuentra respuestas a las preguntas más comunes sobre nuestra galería de arte
          </p>
        </div>

        <div className="faqs-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h3>¿No encontraste lo que buscabas?</h3>
          <p>Si tienes alguna pregunta específica que no hemos cubierto, no dudes en contactarnos.</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> info@artgallery.com
            </div>
            <div className="contact-item">
              <strong>Teléfono:</strong> +54 11 1234-5678
            </div>
            <div className="contact-item">
              <strong>Horarios:</strong> Lunes a Viernes de 9:00 a 18:00 hs
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
