import Link from "next/link";

export const metadata = {
  title: "Cookies Policy | INOXCROM",
  description: "Cookies policy for INOXCROM website"
}

export default function CookiesPolicyPage() {
  return (
    <div className="content-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Link href="/au" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500">Cookies Policy</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Cookies Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
          <p className="text-gray-600 mb-4">
            A cookie is a small text file that is stored in your browser when you visit almost any web page. Its usefulness is that the web is able to remember your visit when you browse that page again. Cookies usually store technical information, personal preferences, content customization, usage statistics, links to social networks, access to user accounts, etc. The objective of the cookie is to adapt the content of the web to your profile and needs, without cookies the services offered by any page would be significantly reduced. If you want to see more information about what cookies are, what they store, how to eliminate them, deactivate them, etc., please go to this link.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies used on this website</h2>
          <p className="text-gray-600 mb-4">
            Following the guidelines of the Spanish Agency for Data Protection we proceed to detail the use of cookies made by this website in order to inform you as accurately as possible.
          </p>
          <ul className="list-disc pl-5 text-gray-600 mb-4">
            <li>
              This website uses the following own cookies:
              <ul className="list-disc pl-5 text-gray-600">
                <li>Session cookies, to guarantee that the users who write comments on the blog are human and not automated applications. In this way, spam is fought.</li>
              </ul>
            </li>
            <li>
              This website uses the following third-party cookies:
              <ul className="list-disc pl-5 text-gray-600">
                <li>Google Analytics: Stores cookies to be able to compile statistics on the traffic and volume of visits to this website. By using this website you are consenting to the processing of information about you by Google. Therefore, the exercise of any right in this regard must be done by communicating directly with Google.</li>
                <li>Social networks: Each social network uses its own cookies so that you can click on buttons such as Like or Share.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Deactivation or elimination of cookies</h2>
          <p className="text-gray-600 mb-4">
            At any time you can exercise your right to deactivate or delete cookies from this website. These actions are performed differently depending on the browser you are using. Here we leave you a quick guide for the most popular browsers
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Additional notes</h2>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Neither this website nor its legal representatives are responsible for the content or the veracity of the privacy policies that third parties mentioned in this cookie policy may have.</li>
            <li>Web browsers are the tools in charge of storing cookies and from this place you must exercise your right to eliminate or deactivate them. Neither this website nor its legal representatives can guarantee the correct or incorrect manipulation of cookies by the aforementioned browsers.</li>
            <li>In some cases it is necessary to install cookies so that the browser does not forget your decision not to accept them.</li>
            <li>In the case of Google Analytics cookies, this company stores cookies on servers located in the United States and agrees not to share it with third parties, except in cases where it is necessary for the operation of the system or when the law requires for this purpose. According to Google, it does not save your IP address. Google Inc. is a company adhering to the Safe Harbor Agreement that guarantees that all transferred data will be treated with a level of protection in accordance with European regulations. You can consult detailed information in this regard at this link. If you want information about the use that Google gives to cookies, we attach this other link.</li>
            <li>For any questions or queries about this cookie policy, do not hesitate to contact us through the contact section.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}