export default function RefillInfo() {
  const refills = [
    {
      meters: "750m",
      type: "Roller",
      description: "100 urban sketches",
    },
    {
      meters: "1800m",
      type: "easyFLOW",
      description: "A year-long journal",
    },
    {
      meters: "5900m",
      type: "RollyGraph TX",
      description: "200 pages of classroom notes",
    },
    {
      meters: "6500m",
      type: "Metal Soft",
      description: "2 notes a day for a year!",
    },
  ]

  return (
    <div className="py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/refill-bg.jpg")' }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">How long will your refill write?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {refills.map((refill) => (
            <div key={refill.meters} className="text-center">
              <h3 className="text-4xl font-bold mb-2">{refill.meters}</h3>
              <p className="text-sm text-gray-600 mb-1">{refill.type}</p>
              <p className="text-sm">{refill.description}</p>
            </div>
          ))}
        </div>

        <a href="/au/catalog?filter=refills" className="inline-block px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors">Browse refills</a>
      </div>
    </div>
  )
}
