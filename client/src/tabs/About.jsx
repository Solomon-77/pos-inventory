

const About = () => {
  const developers = [
    { name: "Cristobal, Armani", role: "UI Designer / Documentation", email: "qacdcristobal@tip.edu.ph", image: "https://scontent-mnl1-2.xx.fbcdn.net/v/t1.15752-9/448735876_1599384410637086_856931067631797180_n.png?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=et38bj9KW8kQ7kNvgHAYHmj&_nc_ht=scontent-mnl1-2.xx&oh=03_Q7cD1QGdRhDuNTXfQsv5TJcI9DZ_H6WPqTBFxem3nvorErGwsQ&oe=66A21BC8" },
    { name: "Eustaquio, Cyrill", role: "Lead Developer / UI/UX Designer", email: "qckreustaquio@tip.edu.ph", image: "https://scontent.fmnl9-3.fna.fbcdn.net/v/t1.15752-9/448703536_792296059702312_2466335223817342246_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_ohc=lkwN3vBqaCgQ7kNvgG0f4Ri&_nc_ht=scontent.fmnl9-3.fna&gid=AS7uJsDTrLT53HG-Kn2FLg5&oh=03_Q7cD1QENb8yH-84ChddIpSN7J1noD47GIQfZIgg0UFxGWS2K3Q&oe=66A8B500" },
    { name: "Gillego, Gab", role: "The Overseer", email: "qgamgillego@tip.edu.ph", image: "https://images.ctfassets.net/ub3bwfd53mwy/5WFv6lEUb1e6kWeP06CLXr/acd328417f24786af98b1750d90813de/4_Image.jpg?w=750" },
    { name: "Mata, Francis", role: "UI Designer / Documentation", email: "qfjmmata@tip.edu.ph", image: "https://scontent.fmnl4-7.fna.fbcdn.net/v/t1.15752-9/448763219_1245749233497661_8356426628384819243_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=CE-qzWZ35wAQ7kNvgEXAPVu&_nc_ht=scontent.fmnl4-7.fna&oh=03_Q7cD1QHCHwqWZHC7UOTIzlF4Fqw4TthdqTR-9MgqPC9XctzAbg&oe=66A21B4C" },
    { name: "Naz, Robie", role: "UI Designer / Documentation", email: "qbrbnaz@tip.edu.ph", image: "https://scontent.fmnl4-3.fna.fbcdn.net/v/t1.15752-9/441963866_491117730086949_8950016932612432863_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=YZlvXh3Fy4QQ7kNvgEWRiLM&_nc_ht=scontent.fmnl4-3.fna&oh=03_Q7cD1QGB6FLQAVGfVxfqXn12Qiifi71aaZN_2xWnoKkkSBaUgA&oe=66A2068E" },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-6 text-center">About The GenMed Pharmacy Management System</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg text-center font-semibold leading-6 mb-2 text-gray-900">
              Welcome to GenMed Pharmacy Management System
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The system is designed to streamline pharmacy operations, enhance inventory management, and improve customer service. With features like point of sale, real-time stock tracking, inventory management, and sales analytics, Medinet software helps pharmacies to operate more efficiently and provide better service to their customers.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              The system utilizes advanced security measures, including Argon for password hashing and SHA-256 for tokenization. It is built on a robust tech stack featuring NodeJS v20.13.1, Express v4.19.2, React v18.2.0, MongoDB v8.0.0, and Tailwind CSS v3.4.4, with Vite as the build tool, ensuring a modern, efficient, and secure pharmacy management solution.
            </p>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl text-center leading-6 font-medium text-gray-900">
              The Development Team
            </h2>
            <p className="text-center mt-2 text-sm text-gray-500">
              Meet the people behind the genmed pharmacy point of sale and inventory management system
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {developers.map((dev, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <img className="h-[80px] w-[80px] rounded-full mr-4" src={dev.image} alt={dev.name} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800 truncate">
                          {dev.name}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {dev.role}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-600">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {dev.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 pb-8">
          © 2024 Pharmacy Management System. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default About