"use client";

import React, { useState } from "react";
import Link from "next/link";

const STORES = [
  { name: "ANGLADA", address1: "Plaça Major, 12", address2: "08500 Vic, Barcelona" },
  { name: "ARPALI COPISTERIA", address1: "C/Valldoreix, 45", address2: "08172 Sant Cugat del Vallès, Barcelona" },
  { name: "ARQUES COPIES", address1: "Plaça del Mig, 5", address2: "17800 Olot, Girona" },
  { name: "BETA PAPERERÍA", address1: "Avda. Agricultor, 12", address2: "12600 La Vall de Uxó, Castelló" },
  { name: "BUREAU VALLÉE VALENCIA", address1: "C/ Clariano, 18", address2: "46021 València, València" },
  { name: "CARLIN", address1: "Avda. Dr. Carrillo Guerrero, 1", address2: "29400 Ronda, Málaga" },
  { name: "CARLIN BADALONA", address1: "Carrer de la Creu, 77", address2: "08912 Badalona, Barcelona" },
  { name: "CARLIN BURGOS", address1: "C/ Juan Ramón Jimenez, s/n", address2: "09007 Burgos, Burgos" },
  { name: "CARLIN CASTRELOS", address1: "Av. de Castrelos, 188", address2: "36210 Vigo, Pontevedra" },
  { name: "CARLIN FRAGA", address1: "Avda. de los Deportes, 19", address2: "22520 Fraga, Huesca" },
  { name: "CARLIN HIPERPAPERERIA", address1: "C/Marqués de Monistrol, 7", address2: "08970 Sant Joan Despi, Barcelona" },
  { name: "CARLIN LAINUR", address1: "Avda. Catalunya, 249", address2: "08184 Palau de Plegamans, Barcelona" },
  { name: "CARLIN MONCADA", address1: "C/ Badia, 63", address2: "46113 Moncada, València" },
  { name: "CARLIN TOTANA", address1: "C/ Del Pilar nº 5", address2: "30850 Totana, Murcia" },
  { name: "CARLIN VILLAVICIOSA", address1: "Avda. Quitapesares, 22", address2: "28670 Villaviciosa de Odón, Madrid" },
  { name: "CARLIN ZAMORA", address1: "C/ Cortinas de San Miguel, 6-8", address2: "49015 Zamora, Zamora" },
  { name: "CARRANZA", address1: "C/ Carranza, 8", address2: "28004 Madrid, Madrid" },
  { name: "CASA AMBROSIO RODRIGUEZ", address1: "C/ Duque de la Victoria, 3", address2: "47013 Valladolid, Valladolid" },
  { name: "CASA MARCHENA", address1: "C/ Castaño, 1", address2: "41740 Lebrija, Sevilla" },
  { name: "COMERCIAL MANUEL URONES", address1: "C/ Carreño Miranda, 7", address2: "33013 Oviedo, Asturias" },
  { name: "COPIA Y PEGA", address1: "Calle de Abtao, 38", address2: "28007 Madrid, Madrid" },
  { name: "COPISTERIA SANT CELONI", address1: "Carretera Vella, 138", address2: "08470 Sant Celoni, Barcelona" },
  { name: "COPY-SHOP 508", address1: "Avda. Camí Ral, 508", address2: "08302 Mataro, Barcelona" },
  { name: "COPYTECNIC", address1: "C/ Velazquez, s/n", address2: "11010 Cádiz, Cádiz" },
  { name: "DIN-A-12", address1: "C/Narcís Soler, 5", address2: "17600 Figueres, Girona" },
  { name: "DISPAPEL", address1: "Crta. Ubeda-Málaga, Km. 37,5", address2: "23100 Mancha Real, Jaén" },
  { name: "ELS DIARIS", address1: "Plaza de Jovellar, 15", address2: "12500 Vinaroz, Castelló" },
  { name: "EMILIANNA", address1: "Plaça Europa, 14", address2: "17600 Figueres, Girona" },
  { name: "ENCUADERNACIONES GARIN", address1: "Plaza Buen Pastor / Artzai Onaren Enparantza, 20", address2: "20005 San Sebastián, Gipuzkoa" },
  { name: "ESPRIU BENIDORM", address1: "Avda. Beniardá, 9-11", address2: "03502 Benidorm, Alacant" },
  { name: "ESTANC CODERCH", address1: "Pl. Anselm Clave, 3, planta 1", address2: "08440 Cardedeu, Barcelona" },
  { name: "ESTVDIO", address1: "Avda. de Los Castros, 53-C", address2: "39005 Santander, Cantabria" },
  { name: "FOLDER", address1: "C/ Catalanes, 9", address2: "18600 Motril, Granada" },
  { name: "FOLDER HUESCA", address1: "C/ Alcoraz, 6, 2202", address2: "22002 Huesca, Huesca" },
  { name: "FOLDER MONTCADA", address1: "C/Barcelona Centre, 15", address2: "08110 Montcada i Reixac, Barcelona" },
  { name: "FOLDER VALLADOLID CENTRO", address1: "C/ Bajada de la Libertad, 6", address2: "47002 Valladolid, Valladolid" },
  { name: "FOLDER ZARAGOZA", address1: "C/ Santo Domingo, 5, Pol. Centrovia", address2: "50198 La Muela, Zaragoza" },
  { name: "GRÁFICAS ZAR", address1: "Avda. de Madrid, 205", address2: "50017 Zaragoza, Zaragoza" },
  { name: "GUERRO PAPELERIAS", address1: "C/ Canovas del Castillo, 6", address2: "47001 Valladolid, Valladolid" },
  { name: "HEADQUARTERS - PensFromBCN", address1: "C/Pallars, Nº 85, Planta 6 Nº4,", address2: "08018 Barcelona, Barcelona" },
  { name: "HERMANOS ZALVEZ, S.L.", address1: "C/ Teodoro Camino, 27-B", address2: "02002 Albacete, Albacete" },
  { name: "IMAGEN. Todo en rotulación y escritura", address1: "C/ Carril del Picón, 24", address2: "18002 Granada, Granada" },
  { name: "IMPRENTA BLASCO", address1: "Paseo Teruel, 8", address2: "50004 Zaragoza, Zaragoza" },
  { name: "IMPRENTA PAPELERÍA PEDRO CHUECA", address1: "Paseo de la Constitución, 10", address2: "50500 Tarazona, Zaragoza" },
  { name: "IMPRENTA Y PAPELERÍA GRAFBILL", address1: "Carrer de l'Enginyer Balaguer, 97", address2: "46240 Carlet, València" },
  { name: "L´ALTELL", address1: "C/ Canal, 12", address2: "17820 Banyoles, Girona" },
  { name: "L´ELEFANT", address1: "Avda. Catalunya, 98", address2: "08150 Parets del Vallès, Barcelona" },
  { name: "LA CARPETA", address1: "C/ Comtal, Nº 24", address2: "08002 Barcelona, Barcelona" },
  { name: "LA GRALLA", address1: "C/Santa Elisabet, 5", address2: "08401 Granollers, Barcelona" },
  { name: "LA IKASTOLA", address1: "C/Diagonal, 1", address2: "08420 Canovelles, Barcelona" },
  { name: "LA PAPERERIA", address1: "C/Fortuny, 17", address2: "43001 Tarragona, Tarragona" },
  { name: "LA PLAÇA JOIERIA I RELLOTGERIA", address1: "Plaça Jaume I, 14", address2: "46910 Sedavi, València" },
  { name: "LAS HERAS LIBRERÍA PAPELERÍA", address1: "Calle del Collado, 38", address2: "42002 Soria, Soria" },
  { name: "LIBRERIA BARCINO", address1: "C/Comte d´Urgell, 222", address2: "08036 Barcelona, Barcelona" },
  { name: "LIBRERIA CLARÍN", address1: "Avda. Alcalde Francisco Orejas Sierra, 4", address2: "33401 Avilés, Asturias" },
  { name: "LIBRERIA HIJOS DE SANTIAGO RODRIGUEZ", address1: "Plaza Mayor, 22", address2: "09003 Burgos, Burgos" },
  { name: "LLIBRERIA AUSIÀS", address1: "C/ Ausiàs March, 32", address2: "12540 Villarreal, Castelló" },
  { name: "LLIBRERIA BARBA", address1: "C/Rafael de Casanova, 45", address2: "08750 Molins de Rei, Barcelona" },
  { name: "LLIBRERIA BOCHACA", address1: "C/Peressall, 15", address2: "25620 Tremp, Lleida" },
  { name: "LLIBRERIA EGARA", address1: "Carrer de Gutenberg, 19", address2: "08224 Terrassa, Barcelona" },
  { name: "LLIBRERIA ELIAS", address1: "C/ Santa Anna, 11", address2: "17258 L´Estartit, Girona" },
  { name: "LLIBRERIA GALLISSA", address1: "Plaça Vila de Paris, 1", address2: "17310 Lloret de Mar, Girona" },
  { name: "LLIBRERIA LISBOA", address1: "Avda. País Valencià, 11", address2: "12500 Vinaroz, Castelló" },
  { name: "LLIBRERIA MÁRQUEZ", address1: "C/Muralla Sant Llorenç, 2", address2: "08302 Mataró, Barcelona" },
  { name: "LLIBRERIA PAPERERIA CASELLES", address1: "C/Major, 46", address2: "25007 Lleida, Lleida" },
  { name: "LLIBRERIA PAPERERIA GARCÍA GARAY", address1: "C/ Xúquer, 18", address2: "46600 Alcira, València" },
  { name: "LLIBRERIA PUJOL", address1: "C/Cort, 25", address2: "08720 Vilafranca del Penedès, Barcelona" },
  { name: "LLIBRERIA RUBIRALTA", address1: "C/Born, 24", address2: "08241 Manresa, Barcelona" },
  { name: "LLIBRERIA SARRI", address1: "Plaça Major, 24-26", address2: "25230 Mollerusa, Lleida" },
  { name: "LLIBRERIA SOLÉ", address1: "Carrer Major, 28", address2: "25560 Sort, Lleida" },
  { name: "LLIBRERIA TREITO", address1: "Plaza de Asturias, 5", address2: "33800 Cangas de Narcea, Asturias" },
  { name: "LLIBRERIA VIDAL", address1: "Av. Cruceiro, 29", address2: "36990 Vilalonga, Pontevedra" },
  { name: "LUCEROS 18, S.L.", address1: "Plaza de los Luceros, 18", address2: "03004 Alacant, Alacant" },
  { name: "MATER", address1: "Crta. de San Hipòlit, 23", address2: "08500 Vic, Barcelona" },
  { name: "MATEC PAPERERIA", address1: "C/ Llibertat, 21", address2: "17820 Banyoles, Girona" },
  { name: "MONTTE", address1: "Urbieta Kalea, 64", address2: "20006 San Sebastián, Gipuzkoa" },
  { name: "OFFIPAPEL", address1: "C/ Gil Cordero, 7", address2: "10001 Cáceres, Cáceres" },
  { name: "OFICOMEDIAS", address1: "Carrer de les Comèdies, 19", address2: "46003 València, València" },
  { name: "OFIPOINT", address1: "Avda. Blas de Infante, 4", address2: "21440 Lepe, Huelva" },
  { name: "OFIRETAIL, S.L.", address1: "Plata, 22", address2: "47012 Valladolid, Valladolid" },  
  { name: "OFITROPOLIS", address1: "C/Pi i Margall, 20", address2: "08840 Viladecans, Barcelona" },
  { name: "PALÉ PAPER", address1: "C/Cavallers, 16", address2: "17200 Palafrugell, Girona" },
  { name: "PAPELERA DEL ESLA", address1: "C/ Burgo Nuevo, 46", address2: "24001 León, León" },
  { name: "PAPELERÍA ARENAS", address1: "C/Gran, 18", address2: "08310 Argentona, Barcelona" },
  { name: "PAPELERÍA BITLLOCH", address1: "C/ Nou, 9", address2: "17300 Blanes, Girona" },
  { name: "PAPELERÍA BORONAT", address1: "C/Josep Maria de Molina, 8", address2: "08980 Sant Feliu de Llobregat, Barcelona" },
  { name: "PAPELERÍA CARMONA", address1: "C/ Méndez Núñez, 1", address2: "41001 Sevilla, Sevilla" },
  { name: "PAPELERÍA CASTILLO", address1: "Avda. Jose Rodriguez Ruano, 25", address2: "02640 Almansa, Albacete" },
  { name: "PAPELERÍA CATURLA", address1: "Carrer Jaume I, 21", address2: "03550 Sant Joan d´Alacant, Alacant" },
  { name: "PAPELERÍA CODORNIU", address1: "Rambla Can Mora, s/n", address2: "08172 Sant Cugat del Vallès, Barcelona" },
  { name: "PAPELERÍA FERRER", address1: "C/ Sierpes, 5", address2: "41004 Sevilla, Sevilla" },
  { name: "PAPELERÍA FIGUEROLA", address1: "Plaça Major, 70", address2: "08202 Sabadell, Barcelona" },
  { name: "PAPELERÍA GARABATOS", address1: "C/ Suecia, 93", address2: "28022 Madrid, Madrid" },
  { name: "PAPELERÍA GEA", address1: "C/ Sardenya, 359", address2: "08025 Barcelona, Barcelona" },
  { name: "PAPELERÍA GRABO", address1: "Avda. de Andalucía, 24", address2: "28343 Valdemoro, Madrid" },
  { name: "PAPELERÍA IBRAHIM", address1: "C/ Real, 3", address2: "13300 Valdepeñas, Ciudad Real" },
  { name: "PAPELERÍA INÉS", address1: "Rei En Jaume, 3", address2: "46400 Cullera, València" },
  { name: "PAPELERÍA INMA", address1: "Avda. Riu Ebre, 15", address2: "12540 Villarreal, Castelló" },
  { name: "PAPELERÍA LA ROCHA", address1: "Pol. Ind. P-29, C/ Jade, 2", address2: "28400 Collado Villalba, Madrid" },
  { name: "PAPELERÍA LANIGO", address1: "Passeig de Vilanova, 8", address2: "08880 Cubelles, Barcelona" },
  { name: "PAPELERÍA LOURDES", address1: "C/ San Juan, 3", address2: "28823 Coslada, Madrid" },
  { name: "PAPELERÍA LUMEN", address1: "C/ Bami, 11", address2: "41013 Sevilla, Sevilla" },
  { name: "PAPELERÍA MARINA", address1: "Avda. Gregorio Gea, 42", address2: "46920 Mislata, València" },
  { name: "PAPELERÍA MARTÍ", address1: "C/ Pelayo, Nº 3", address2: "46007 Valencia, València" },
  { name: "PAPELERÍA MARTA", address1: "C/Mossen Josep Duran, 12", address2: "08620 Sant Vicenç dels Horts, Barcelona" },
  { name: "PAPELERÍA MAYOR", address1: "C/ Mayor, 22", address2: "28921 Alcorcón, Madrid" },
  { name: "PAPELERÍA MISTRAL", address1: "C/Tamarit, 116", address2: "08015 Barcelona, Barcelona" },
  { name: "PAPELERÍA MON D´ART", address1: "C/Tribala, 55-59", address2: "08397 Pineda de Mar, Barcelona" },
  { name: "PAPELERÍA NAVALÓN", address1: "C/ Joaquín María López, 26", address2: "03400 Villena, Alacant" },
  { name: "PAPELERÍA NORNIELLA", address1: "C/ Covadonga, 32", address2: "33002 Oviedo, Asturias" },
  { name: "PAPELERÍA NOVELDENSE", address1: "Avda. Benito Perez Galdos, 6", address2: "03660 Novelda, Alacant" },
  { name: "PAPELERÍA NURIA", address1: "C/Comte de Rius, 3", address2: "43003 Tarragona, Tarragona" },
  { name: "PAPELERÍA OLVERA", address1: "C/ Lobero, 36", address2: "04700 El Ejido, Almería" },
  { name: "PAPELERÍA PLANAS", address1: "Rambla Can Mora, s/n", address2: "08172 Sant Cugat del Vallès, Barcelona" },
  { name: "PAPELERÍA RAMBLA", address1: "C/ Rambla, 17", address2: "30001 Murcia, Murcia" },
  { name: "PAPELERÍA ROGER", address1: "C/ Jovara, 321", address2: "08370 Calella, Barcelona" },
  { name: "PAPELERÍA SALA", address1: "Avda. Carlos Soler, 39", address2: "03110 Muxamel, Alacant" },
  { name: "PAPELERÍA SALAZAR", address1: "C/ Luchana, 7", address2: "28010 Madrid, Madrid" },
  { name: "PAPELERÍA SAN AGUSTÍN", address1: "C/ Infante Don Fernando, 15", address2: "29200 Antequera, Málaga" },
  { name: "PAPELERÍA SAN ANTONIO", address1: "C/ San Antonio, 3", address2: "46740 Carcagente, València" },
  { name: "PAPELERÍA SANZ", address1: "C/ Santa Lucía, 9", address2: "50700 Caspe, Zaragoza" },
  { name: "PAPELERÍA TÉCNICA A3", address1: "Rúa Marquesa, 5", address2: "36002 Pontevedra, Pontevedra" },
  { name: "PAPELERÍA TÉCNICA DE ESTEPONA", address1: "C/ Gútemberg, 2", address2: "29680 Estepona, Málaga" },
  { name: "PAPELERÍA TÉCNICA JUANJO", address1: "C/ Bernat Fenollar, 13", address2: "46021 València, València" },
  { name: "PAPELERÍA TORREVIEJA", address1: "Avda. Gregorio Marañón, 6", address2: "03181 Torrevieja, Alacant" },
  { name: "PAPELERÍA TORRES", address1: "Carrer d´En Sanç, 6", address2: "46001 València, València" },
  { name: "PAPELNOR", address1: "C/ Mies de San Juan, S/N", address2: "39600 Santander, Cantabria" },
  { name: "PAPIROS", address1: "Avda. de la Constitució, 158-160", address2: "08860 Castelldefels, Barcelona" },
  { name: "PAPIROS PEN", address1: "Avda. Francesc Macià, 29", address2: "08921 Sta. Coloma de Gramanet, Barcelona" },
  { name: "PENTER", address1: "Campus UPV/EHU de Leioa, s/n", address2: "48940 Leioa, Bizkaia" },
  { name: "PICKING PACK MEDINA", address1: "C/ Simón Ruiz, 27", address2: "47400 Medina del Campo, Valladolid" },
  { name: "PLOTTER", address1: "C/ Tajonar, 10", address2: "31006 Pamplona, Nafarroa" },
  { name: "SACRISTÁN", address1: "C/ Mayor, 27", address2: "28013 Madrid, Madrid" },
  { name: "SANATORIO ESTILOGRÁFICO", address1: "C/ Alarcón Luján, 13", address2: "29005 Málaga, Málaga" },
  { name: "SANTOS OCHOA", address1: "Avda. de Aragón, 2", address2: "44600 Alcañiz, Teruel" },
  { name: "SG94", address1: "Avda. S´Agaró, 56", address2: "17250 Platja d´Aro, Girona" },
  { name: "SOTRES-LANZA", address1: "C/ Ingeniero Marquina, 7", address2: "33004 Oviedo, Asturias" },
  { name: "STEIN", address1: "C/Pompeu Fabra, 10", address2: "17002 Girona, Girona" },
  { name: "STUDI PAPERERÍA", address1: "Carrer Major, 73", address2: "12001 Castelló, Castelló" },
  { name: "SUM. OFICINA OFIPAPEL", address1: "Bulevar Chajofe, 4", address2: "38650 Los Cristianos, Santa Cruz de Tenerife" },
  { name: "TECNODELTA", address1: "Carrer d´ Albacete, 58", address2: "46007 València, València" },
  { name: "VALLÈS IMPRENTA-PAPERERIA", address1: "C/Cerdanyola, 3", address2: "08211 Castellar del Vallès, Barcelona" }
];

export default function PointsOfSale() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = STORES.filter(store => {
    const searchString = `${store.name} ${store.address1} ${store.address2}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex items-center text-gray-500 mb-4 text-sm sm:text-base">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-700">Points of sale</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Points of sale</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side: Google Maps placeholder - full width on mobile, 70% on desktop */}
        <div className="w-full lg:w-[70%] order-2 lg:order-1">
          <div className="h-[300px] sm:h-[400px] lg:h-[700px] border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto">
              <p className="text-gray-500 flex items-center justify-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12 4.775 4.206 16.07A1.65 1.65 0 005.77 19h12.54a1.65 1.65 0 001.564-2.93L12 11.314l-1.562 2.686"></path>
                </svg>
                Oops! Something went wrong.
              </p>
              <p className="text-gray-500 mt-2">This page didn't load Google Maps correctly. See the JavaScript console for technical details.</p>
            </div>
          </div>
        </div>

        {/* Right side: Search and store list - full width on mobile, 30% on desktop */}
        <div className="w-full lg:w-[30%] order-1 lg:order-2">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search stores..."
              className="border border-gray-300 rounded-md px-4 py-3 w-full pr-10 text-base sm:text-sm focus:ring-2 focus:ring-[#0093D0] focus:border-[#0093D0] transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div className="h-[300px] sm:h-[400px] lg:h-[600px] overflow-y-auto space-y-4 pr-2 sm:pr-4">
            {filteredStores.map((store, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-base sm:text-sm text-gray-900">{store.name}</h3>
                <p className="text-sm sm:text-xs text-gray-600 mt-2">{store.address1}</p>
                <p className="text-sm sm:text-xs text-gray-600">{store.address2}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 py-6 sm:py-8 text-center bg-gray-50 rounded-lg shadow-sm">
        <p className="text-sm sm:text-base text-gray-700 px-4">If you want to distribute Inoxcrom® products</p>
        <Link href="/au/contact">
          <button className="bg-[#0093D0] hover:bg-[#0077A8] text-white font-bold py-2.5 px-6 sm:px-8 rounded-md mt-4 text-sm sm:text-base transition-colors">
            Contact us
          </button>
        </Link>
      </div>
    </div>
  );
}