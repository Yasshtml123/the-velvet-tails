import { Link } from 'react-router-dom';

export default function PolicyPage({ title, children }) {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-gray-600">
                        Last updated: December 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-purple max-w-none">
                    {children}
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        to="/products"
                        className="text-velvet-purple hover:text-velvet-purple/80 font-medium inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Privacy Policy Component
export function PrivacyPolicy() {
    return (
        <PolicyPage title="Privacy Policy">
            <section className="space-y-6 text-gray-700">
                <p>
                    Kristia Private Limited ("Company" "We", "Us", or "Our") a private limited company with its registered office at 82, Sector 18, Faridabad, Haryana. 121002 operates the website www.thevelvettails.com (hereinafter referred to as the "Platform"). The Company is committed to protecting Your privacy and the information that You share while using the Platform. We value the trust You place in Us. That's why We maintain the highest security standards for securing the transactions and Your information.
                </p>

                <p>
                    This privacy policy ("Privacy Policy") specifies the manner in which personal data and other information is collected, received, stored, processed, disclosed, transferred, dealt with, or otherwise handled by the Company. This Privacy Policy does not apply to information that You provide to, or that is collected by, any third-party through the Platform, and any Third-Party Sites (defined below) that You access or use in connection with the Services offered on the Platform.
                </p>

                <p>
                    Please read the Privacy Policy carefully prior to using or registering on the Platform or accessing any material, information or availing any Services through the Platform.
                </p>

                <p>
                    By visiting the Platform or setting up/creating an account on the Platform for availing the Services and clicking on the "I accept" button provided on the Platform, You ("You", "Your", "Yourself" as applicable) accept and agree to be bound by the terms and conditions of this Privacy Policy and consent to the Company collecting, storing, processing, transferring, and sharing information including Your Personal Information in accordance with this Privacy Policy. This Privacy Policy is incorporated into and subject to our Terms of Service ("Terms") and shall be read harmoniously and in conjunction with them. All capitalised terms used herein however not defined under this Privacy Policy shall have the meaning ascribed to them under the Terms.
                </p>

                <p>
                    This Privacy Policy (i) will be considered to be an electronic record under the Indian data privacy laws including the Information Technology Act, 2000 read with rules and regulations made thereunder; and (ii) will not require any physical, electronic, or digital signature by the Company.
                </p>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Collection of Information</h2>
                    <p>
                        You may provide or the Company may collect certain personal information while You register on the Platform and/or use the Services. This includes: (a) Your name, electronic mail address, password, IP address, billing address, shipping address and other relevant details; (b) Your content, received, uploaded or posted using the Platform, including messages, images, videos and feedback; (c) any information provided by You while availing customer support, and (d) information You choose to upload, sync or import from the device on which the Platform is being used (collectively "Personal Information"). All information disclosed by You on the Platform shall be deemed to be shared willingly by You and without any coercion. No liability pertaining to the authenticity, genuineness, misrepresentation, fraud, negligence, etc. of the information disclosed by You shall lie on the Company.
                    </p>

                    <p>
                        The Company may collect non-personal information relating to Your activities while accessing the Service or other information from and about the devices through which the Platform is used including SDK/API/JS code version, browser, internet service provider, operating system, browser type, cookie information, timestamp, application identifier, application version, application distribution channel, independent device identifier, Android ad master identifier, network card (MAC) address, and international mobile device identification code (IMEI), the equipment model, the terminal manufacturer, the terminal device operating system version, the session start / stop time, location, language, the time zone and the network state (WiFi and so on).
                    </p>

                    <p>
                        In addition to the profile information, You may also tell us Your exact location if You choose to enable Your computer or mobile device to send us location information. The Company may use and store information about Your location to provide features of the Service to You and to improve and customize the Service and provide location based Services to You. You can withdraw Your consent at any time by disabling the location-tracking functions on Your mobile. However, this may affect Your enjoyment of certain functionalities on the Platform. In addition to the above, We identify and use Your IP address to also help diagnose problems with Our server, resolve such problems and administer the Platform. Your IP address is also used to help identify You and to gather broad demographic information.
                    </p>

                    <p>
                        Our servers automatically record information ("Log Data") created by Your use of the Service through the Platform. Log Data may include information such as Your IP address, operating system, the referring web page, pages visited, location, Your mobile carrier, device and application IDs, search terms and the manner of Your interaction with links across the Platform, including email notifications, by clicking redirecting links or through other means. The Company receives Log Data when You interact with the Service. The Company uses Log Data to provide Service, to measure, customize, and improve the Service, and to aid a better user experience. We may also collect data using web beacons, tags, or pixels.
                    </p>

                    <p>
                        When payment information is being transmitted on or through the Platform, it will be protected by encryption technology. In case You make any payment on the Platform in relation to the Service, You understand and acknowledge that the Company only facilitates the processing of such payment by third-party payment gateway and all financial information including bank account details is collected by such third-party payment gateway and not by the Company. You expressly consent to the sharing of Your information with third party service providers, including payment gateways, to process payments and manage your payment-related information. Hence, the Company cannot guarantee that transmissions of Your payment-related information or Personal Information will always be secure or that unauthorized third parties will never be able to defeat the security measures taken by the Company or the Company's third-party service providers. The Company will not be liable for any acts or omissions on the part of the payment gateway. You should view the terms of service and the privacy policy of such third-party payment gateway prior to disclosing any sensitive personal information to such third-party payment gateway.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Usage of Information</h2>
                    <p className="mb-2">The information as specified in Clause 1, may be used by the Company for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>for Your registration, login, and management of account on the Platform;</li>
                        <li>to confirm Your identity directly and/or through third parties;</li>
                        <li>to provide You Services and improve the Services;</li>
                        <li>remembering Your Personal Information so that You are not required to re-enter it the next time You visit the Platform;</li>
                        <li>to understand Your preferences and to enhance and customize Your experience of using the Service and the Platform;</li>
                        <li>for providing customized user relevant suggestion / Services;</li>
                        <li>to communicate with You through mail, e-mail, and telephone or through any other mode of communication, in connection with the Service, or other products or services of the Company;</li>
                        <li>to respond to Your comments, requests, reviews, and questions and provide better Services;</li>
                        <li>to enforce, communicate important notices, updates, or changes in the Services, use of the Platform and the terms/policies including Terms which govern the relationship between You and the Company;</li>
                        <li>to detect, prevent and protect Us from any errors, fraud or other criminal or prohibited activity on the Platform;</li>
                        <li>for internal purposes such as auditing, data analysis, research and improvement relating to the Platform or the Service;</li>
                        <li>for promotion and marketing purposes;</li>
                        <li>for sharing such information with any third party, including any service providers and any of Our group companies, in the course of providing the Services through the Platform;</li>
                        <li>to help promote a safe service on the Platform and protect the security and integrity of the Platform, the Services, and the users; and</li>
                        <li>to transfer data to the regulatory authorities or other appropriate authorities as required by law.</li>
                    </ul>
                    <p className="mt-3">
                        The data gathered from You may also be used for any reason incidental to the reasons listed above; and for any other purpose with Your consent. We use Your Personal Information to send You promotional emails, however, We will provide You the ability to opt-out of receiving such emails from Us. However, You will not be able to opt-out of receiving administrative messages, customer service responses or other transactional communications. Unless and until, You explicitly give Your consent to Us, to do so, We will not share Your Personal Information with another user of the Platform and vice versa.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Collection of Information by Third-Party Sites and Advertisers</h2>
                    <p>
                        When You use the Platform, there may be certain links which may direct You to other websites/platforms or applications not operated/maintained by the Company ("Third Party Site(s)"). The manner in which Your information is collected, received, stored, processed, disclosed, transferred, dealt with and handled by such Third Party Site(s) is governed by the terms and conditions and privacy policy of the respective Third Party Site(s). The Company is not in any manner responsible for the security of such information or their privacy practices or content of those Third – Party Sites and hereby expressly disclaims all liabilities with respect to the manner in which any Third Party Site(s) collects and/or uses Your information.
                    </p>
                    <p>
                        In addition to the information specified above, the Company may collect information from your device through Bluetooth permissions if you choose to enable such functionality. This may include device identifiers and location data, which will be used to enhance your experience and provide location-based services. You can manage your Bluetooth permissions through your device settings at any time.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies</h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            A cookie is a small amount of information that's downloaded to Your computer or device when You visit the Platform. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies. Cookies make Your browsing experience better by allowing the Platform to remember Your actions and preferences (such as login and region selection), and Your trends. This means You will not have to re-enter this information each time You return to the Platform or browse from one page to another.
                        </li>
                        <li>
                            The length of time that a cookie remains on Your computer or mobile device depends on whether it is a "persistent" or "session" cookie. Session cookies last until You stop browsing and persistent cookies last until they expire or are deleted. Most of the cookies We use are persistent and will expire between 30 minutes and two years from the date they are downloaded to Your device.
                        </li>
                    </ul>
                    <p className="mt-3">
                        You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact Your user experience and parts of the Platform may not be fully accessible to You.
                    </p>
                    <p>
                        Most browsers automatically accept cookies, but You can choose whether or not to accept cookies through Your browser controls, often found in Your browser's "Tools" or "Preferences" menu.
                    </p>
                    <p>
                        Additionally, please note that blocking cookies may not completely prevent how We share information with third parties such as Our advertising partners.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Disclosure to Third Parties</h2>
                    <p className="mb-2">
                        The Company may disclose Your information including Personal Information, if required to do so by law and if such action is necessary to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-3">
                        <li>comply with a legal obligation or with laws, regulatory requirements and to respond to lawful requests and legal process;</li>
                        <li>protect and defend the rights or property of the Company, and other users of the Platform including to enforce agreements, policies and Terms of Service;</li>
                        <li>protect the personal safety of the Company, the users of the Platform, or any person, in an emergency;</li>
                        <li>protect the Company from incurring any legal liability;</li>
                        <li>firms representing the Company in judicial proceedings and/or any legal, accounting and auditing firms providing services to the Company; and</li>
                        <li>for reasons incidental to the above.</li>
                    </ul>
                    <p className="mb-3">
                        In such an event the Company shall be under no obligation to inform You or seek Your approval or consent.
                    </p>
                    <p className="mb-3">
                        The Company may disclose Your Personal Information to: (i) any third party to facilitate the provision of the Services including the Platform; and (ii) any third parties who provide services, such as auditing, data analysis, platform improvement and assistance with delivery of goods, relevant marketing messages and advertisements. If You provide a mobile phone number and/or e-mail address, the Company or the third-party service providers or the persons authorized by them, may send You text messages/e-mails in relation to Your use of the Platform. The Company contractually requires these third parties to keep such information confidential and use it only for the purposes for which the Company discloses it to them. These third parties may view, edit, or set their own cookies or may place beacons on Your personal information.
                    </p>
                    <p className="mb-3">
                        The Company may also share aggregated (and de-identified) information with third parties at its discretion.
                    </p>
                    <p className="mb-3">
                        The Company may share Your personal information with third-party vendors, consultants, and other service providers who work for the Company and are bound by contractual obligations to keep such personal information confidential and use it only for the purposes for which the Company discloses it to them. The Company may also share or transfer Your Personal Information to third parties in compliance with the applicable law.
                    </p>
                    <p>
                        The Company may disclose or transfer Your information (personal or otherwise) to any subsidiary or affiliate, and to a third party if the Company sells, transfers, or divests all or a significant portion of the Company's business or assets to another company in connection with or during negotiation of any merger, financing, acquisition, bankruptcy, dissolution, transaction, or other similar proceeding. Such third parties shall be contractually bound to not disclose further, any personal information disclosed to them.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Security</h2>
                    <p>
                        The Company uses reasonable security measures, at the minimum those mandated under applicable laws to safeguard and protect Your data and information. The Company has implemented measures to protect against unauthorized access to, and unlawful interception of Your information. However, security risk cannot be completely eliminated while using the internet. The Company assumes no liability or responsibility for disclosure of Your information due to errors in transmission, unauthorized third-party access, or other causes beyond its control. You play an important role in keeping Your personal information secure. You should not share Your user name, password, or other security information for Your account with anyone. You accept the inherent security implications of providing information over the internet and agree not to hold the Company responsible for any breach of security or the disclosure of personal information unless the Company has been grossly and wilfully negligent.
                    </p>
                    <p>
                        By accepting the terms of this Privacy Policy, You undertake to exercise utmost confidentiality of all data You access by virtue of being a user of the Platform. You undertake not to divulge, share, manipulate, sale or use information collected or accessed in a manner inconsistent with this Privacy Policy and the interests of the Company.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Policy Towards Children</h2>
                    <p>
                        The Platform is intended for a general audience and not for use by anyone younger than the age of 18. In the event the Platform and the Services are being accessed by a person below the age of 18 (eighteen) years ("Minor"), such access shall be deemed to be with the consent of the guardian of such Minor.  The Company does not knowingly collect personal information from children younger than the age of 18 without the consent of a parent or legal guardian; if the Company learns that it has done so, the Company will promptly remove the information from all active databases. If You are a parent or legal guardian who believes that the Company has collected or used their child's personal information, please contact the Company at support@thevelvettails.com.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">User Discretion</h2>
                    <p>
                        Subject to limitations in applicable law, You are entitled to object to or request the restriction of processing of Your Personal Information, and to request access to, rectification, erasure and portability of Your own Personal Information. However, some information may be needed to register on the Platform or to take advantage of some of the features of the Platform. Hence, by choosing not to provide us with the above-mentioned information, You may be unable to access the Services/use the Platform, partially or entirely.
                    </p>
                    <p>
                        If You are a registered user of the Platform, the Platform provides You with tools and account settings to access or modify the profile information You have provided and is associated with Your account.
                    </p>
                    <p>
                        Where the use of Your information is based on consent, You can withdraw this consent at any time without affecting the lawfulness of processing based on consent before its withdrawal. In the event You desire to withdraw Your consent or delete Your Personal Information collected by the Company, You can do so by contacting Us at support@thevelvettails.com. If You are aware of any changes or inaccuracies in Your information, You should inform the Company of such changes so that the records of the Company may be updated or corrected. The Company will respond to Your request as soon as possible under relevant regulation.
                    </p>
                    <p>
                        The Company will retain Your personal information as long as needed to provide the Services, or as required or permitted by applicable laws.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Grievances</h2>
                    <p>
                        In the event You have any grievances relating to the Privacy Policy, please inform the Company within 24 hours of occurrence of the instance from which the grievance has arisen, by writing an email to the Grievance Redressal Officer as follows:
                    </p>
                    <p className="mt-2">
                        Name of the Grievance Redressal Officer: Dheeraj Sharma<br />
                        Contact information: dheeraj@thevelvettails.com
                    </p>
                    <p>
                        The Grievance Redressal Officer shall acknowledge the complaint within twenty four hours and dispose of such complaint within a period of fifteen days from the date of its receipt.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Amendments</h2>
                    <p>
                        We reserve the unconditional right to change, modify, add, or remove portions of this Privacy Policy at any time, without specifically notifying You of such changes. Any changes or updates will be effective immediately. You should review this Privacy Policy regularly for changes. You can determine if changes have been made by checking the "Last Updated" legend above. Your acceptance of the amended Privacy Policy shall signify Your consent to such changes and agreement to be legally bound by the same.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Communications</h2>
                    <p>
                        By using the Website and/or registering yourself at thevelvettails.com you authorize us to contact you via email or phone call or SMS or WhatsApp and offer you our services, imparting product knowledge, offer promotional offers running on the website & offers offered by the associated third parties, for which reasons, personally identifiable information may be collected. And irrespective of the fact that you have also registered yourself under DND or DNC or NCPR service, you still authorize us to give you a call from The Velvet Tails for the above-mentioned purposes.
                    </p>
                </div>
            </section>
        </PolicyPage>
    );
}

