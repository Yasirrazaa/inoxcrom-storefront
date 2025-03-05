import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | INOXCROM",
  description: "Privacy policy for INOXCROM website"
}

export default function PrivacyPolicyPage() {
  return (
    <div className="content-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Link href="/au" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">Privacy Policy</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Pensfrombcn, S.L. informs users of the website about its policy regarding the treatment and protection of personal data of users and customers that may be collected by browsing or contracting services through its website. In this sense, Pensfrombcn, S.L. guarantees compliance with current regulations on the protection of personal data. The use of this website implies acceptance of this privacy policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Collection, purpose and data processing</h2>
          <p className="text-gray-600 mb-4">
            Pensfrombcn, S.L. It has the duty to inform users of its website about the collection of personal data that can be carried out, either by sending an email or by completing the forms included on the website. In this sense, Pensfrombcn, S.L. will be considered responsible for the data collected through the means described above. At the same time Pensfrombcn, S.L. informs users that the purpose of the treatment of the data collected includes: The attention to requests made by users, the inclusion in the contact agenda, the provision of services and the management of the commercial relationship including communications. The operations, procedures and technical procedures that are carried out in an automated or non-automated way and that enable the collection, storage, modification, transfer and other actions on personal data, are considered to be personal data processing.
          </p>
          <p className="text-gray-600 mb-4">
            All personal data, which is collected through the Pensfrombcn, S.L. website, and therefore has the consideration of processing personal data, will be incorporated into the files declared before the Spanish Agency for Data Protection by Pensfrombcn, S.L.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Communication of information to third parties</h2>
          <p className="text-gray-600 mb-4">
            Pensfrombcn, S.L. informs users that their personal data will not be disclosed to third-party organizations, except that said transfer of data is covered by a legal obligation or when the provision of a service implies the need for a contractual relationship with a data processor . In the latter case, the transfer of data to the third party will only be carried out when Pensfrombcn, S.L. have the express consent of the user.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User rights</h2>
          <p className="text-gray-600 mb-4">
            Organic Law 15/1999, of December 13, on the Protection of Personal Data gives interested parties the possibility of exercising a series of rights related to the treatment of their personal data. As long as the user's data is processed by Pensfrombcn, S.L. Users may exercise their rights of access, rectification, cancellation and opposition in accordance with the provisions of current legal regulations on the protection of personal data. To make use of the exercise of these rights, the user must contact a written communication, providing documentation proving their identity (ID or passport), to the following address: Pensfrombcn, SL, Calle Pallars, 85, 6-4, 08018 Barcelona or the address that is substituted in the General Data Protection Registry.
          </p>
          <p className="text-gray-600 mb-4">
            Said communication must reflect the following information: Name and surname of the user, the application request, address and supporting data. The exercise of rights must be carried out by the user himself. However, they may be executed by an authorized person as the legal representative of the authorized person. In such case, the documentation that accredits this representation of the interested party must be provided.
          </p>
        </section>
      </div>
    </div>
  )
}