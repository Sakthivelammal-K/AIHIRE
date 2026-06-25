import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

import {
  MdDashboard,
  MdBusiness,
  MdPeople,
  MdSecurity,
  MdAnalytics,
  MdSettings,
  MdWork,
  MdRecordVoiceOver,
  MdSmartToy,
  MdDescription,
  MdPerson,
  MdAssessment,
  MdFolder,
  MdLogout
} from "react-icons/md";


function Sidebar(){

  const role = localStorage.getItem("role");
  const location = useLocation();


  const menus = {

    admin:[

      {
        name:"Dashboard",
        icon:<MdDashboard />,
        path:"/admin-dashboard"
      },

      {
        name:"Organizations",
        icon:<MdBusiness />,
        path:"/organizations"
      },

      {
        name:"Users",
        icon:<MdPeople />,
        path:"/users"
      },

      {
        name:"Permissions",
        icon:<MdSecurity />,
        path:"/roles"
      },

      {
        name:"Analytics",
        icon:<MdAnalytics />,
        path:"/analytics"
      },

      {
        name:"Settings",
        icon:<MdSettings />,
        path:"/settings"
      }

    ],



    recruiter:[

      {
        name:"Dashboard",
        icon:<MdDashboard />,
        path:"/recruiter-dashboard"
      },


      {
        name:"Jobs",
        icon:<MdWork />,
        path:"/jobs"
      },


      {
        name:"Candidates",
        icon:<MdPeople />,
        path:"/candidates"
      },


      {
        name:"Interviews",
        icon:<MdRecordVoiceOver />,
        path:"/recruiter-interviews"
      },


      {
        name:"AI Results",
        icon:<MdSmartToy />,
        path:"/ai-interview-results"
      },


      {
        name:"Reports",
        icon:<MdAssessment />,
        path:"/reports"
      },


      {
        name:"Profile",
        icon:<MdPerson />,
        path:"/recruiter-profile"
      }


    ],




    candidate:[


      {
        name:"Dashboard",
        icon:<MdDashboard />,
        path:"/candidate-dashboard"
      },


      {
        name:"Applications",
        icon:<MdDescription />,
        path:"/applications"
      },


      {
        name:"Jobs",
        icon:<MdWork />,
        path:"/available-jobs"
      },


      {
        name:"Interviews",
        icon:<MdRecordVoiceOver />,
        path:"/interviews"
      },


      {
        name:"Resume",
        icon:<MdFolder />,
        path:"/resume"
      },


      {
        name:"Profile",
        icon:<MdPerson />,
        path:"/profile"
      }

    ]

  };




  return (

    <aside className="sidebar">


      <div className="logo-area">


        <h1>
          AI<span>HIRE</span>
        </h1>


        <p>
          AI Recruitment Platform
        </p>


      </div>




      <nav>


        <ul>


          {
            menus[role]?.map((item)=>(


              <li key={item.path}>


                <Link

                  to={item.path}

                  className={
                    location.pathname === item.path
                    ?
                    "sidebar-link active-link"
                    :
                    "sidebar-link"
                  }

                >


                  <span className="menu-icon">

                    {item.icon}

                  </span>


                  <span>
                    {item.name}
                  </span>


                </Link>


              </li>


            ))
          }



        </ul>


      </nav>




      <div className="sidebar-bottom">


        <Link
          to="/"
          className="sidebar-link"
        >

          <span className="menu-icon">

            <MdLogout />

          </span>


          Logout


        </Link>


      </div>




    </aside>

  );


}


export default Sidebar;