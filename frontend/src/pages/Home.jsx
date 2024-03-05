import { useEffect, useState } from "react";
import "../styles/home.css";
import axios from "axios";

const Home = () => {
  // Get today date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Weather content
  const [weather, setWeather] = useState({
    city: "",
    weather: "",
    temp: 0,
    humidity: 0,
    visibility: 0,
    wind: 0.0,
    icon: "",
  });

  // States for News:
  // Categories (for example 0 - All; 1 - Tech; 2 - Food); Array of News from API
  const [newsCate, setNewsCate] = useState(0);
  const [news, setNews] = useState([]);

  // States for Tasks:
  // Filter Options (for example type 0 - Today tasks, type 1 - All tasks, status 0 - All, 1 - Uncompleted, 2 - Completed)
  const [tasksOption, setTasksOption] = useState({
    type: 0,
    status: 0,
  });

  // Array of Tasks from API
  const [tasks, setTasks] = useState([]);
  // Array of Tasks after filtered
  const [filteredTasks, setFilteredTasks] = useState([]);

  // To display loading stage
  const [message, setMessage] = useState({
    weather: "Loading...",
    news: "Loading...",
    task: "Loading...",
  });

  // To control open create / edit form: mode 0 - Create; 1 - Edit
  const [openForm, setOpenForm] = useState({
    mode: 0,
    status: false,
  });

  // States for form input
  const [formDesc, setFormDesc] = useState(""); // Task description
  const [formDate, setFormDate] = useState(today); // Task due date
  const [formStatus, setFormStatus] = useState(0); // Task status - Uncompleted or Completed
  const [formID, setFormID] = useState(0); // Task ID if it is for edit mode

  // Shorter string, to avoid long string
  const fixString = (str, size) => {
    var split = str.split(" ");
    if (split.length > size) {
      split = split.slice(0, size);
      return split.join(" ") + "...";
    }
    return split.join(" ");
  };

  // Handle delete a task
  const deleteTask = async (task_id) => {
    // Remove from state
    const newList = tasks.filter((t) => t.task_id !== task_id);
    setTasks(newList);

    // Remove from database
    try {
      await axios.delete(
        `${process.env.REACT_APP_TASKS_API}/apis/tasks/${task_id}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handle filter tasks
  const filterTask = () => {
    var filterList = tasks;

    // Filter today tasks
    if (tasksOption.type === 0) {
      filterList = filterList.filter((t) => t.task_date === today);
    }

    // Filter uncompleted tasks
    if (tasksOption.status === 1) {
      filterList = filterList.filter((t) => t.task_status === 0);
    }

    // Filter completed tasks
    if (tasksOption.status === 2) {
      filterList = filterList.filter((t) => t.task_status === 1);
    }

    return filterList;
  };

  // Handle submit form
  const submitForm = async () => {
    // Handle description empty
    if (formDesc === "") {
      alert("Description empty!");
    } else {
      try {
        // Submit create / edit tasks
        const response = await axios.post(
          `${process.env.REACT_APP_TASKS_API}/apis/tasks/`,
          {
            data: {
              user_id: 1,
              task_id: formID,
              task_desc: formDesc,
              task_date: formDate,
              task_status: formStatus,
              submit_mode: openForm.mode,
            },
          }
        );

        // Get new list of tasks after create
        if (response.data) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Close edit form
        setOpenForm({ mode: 0, status: false });
      }
    }
  };

  // Get Weather
  useEffect(() => {
    const getTodayWeather = async () => {
      try {
        // Set loading message
        setMessage((values) => ({ ...values, weather: "Loading..." }));

        // Call API
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );

        // Update to screen
        if (response.data) {
          setWeather({
            city: response.data.name,
            weather: response.data.weather[0].main,
            temp: Math.round(parseFloat(response.data.main.temp) - 273.15),
            humidity: parseInt(response.data.main.humidity),
            visibility: parseInt(response.data.visibility) / 1000,
            wind: (parseFloat(response.data.wind.speed) * 3.6).toFixed(2),
            icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`,
          });
        }
      } catch (error) {
        // If error
        setMessage((values) => ({
          ...values,
          weather: "Can not get weather data!",
        }));

        console.error(error);
      }
    };

    // Call function
    getTodayWeather();
  }, []);

  // Get News
  useEffect(() => {
    const getTodayNews = async () => {
      try {
        // Set loading message
        setMessage((values) => ({
          ...values,
          news: "Loading...",
        }));

        // Call API
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${
            (newsCate === 0 && "") ||
            (newsCate === 1 && "tech") ||
            (newsCate === 2 && "food")
          }&pageSize=3&language=en&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );

        // Update to screen
        if (response.data) {
          setNews(response.data.articles);
        }
      } catch (error) {
        // If error
        setMessage((values) => ({
          ...values,
          news: "Can not get news data!",
        }));
        console.error(error);
      }
    };

    // Call function
    getTodayNews();
  }, [newsCate]);

  // Get tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        // Set loading message
        setMessage((values) => ({
          ...values,
          tasks: "Loading...",
        }));

        // Call API
        const response = await axios.get(
          `${process.env.REACT_APP_TASKS_API}/apis/tasks/1`
        );

        // Update to screen
        if (response.data) {
          setTasks(response.data);
        }
      } catch (error) {
        // If error
        setMessage((values) => ({
          ...values,
          tasks: "Can not get news data!",
        }));
        console.error(error);
      }
    };

    // Call function
    getTasks();
  }, []);

  // Update tasks data and apply filter
  useEffect(() => {
    setFilteredTasks(filterTask(tasks));
    // eslint-disable-next-line
  }, [tasks, tasksOption]);

  return (
    <div className="Container">
      <div className="Home_Container">
        <div className="Home_Top_Container">
          {weather.city !== "" ? (
            <div className="Home_Weather_Widget">
              <div className="Weather_Content_Container">
                <p>{weather.city}</p>
                <p>{weather.temp}°C</p>
                <div className="Weather_Image_Container">
                  <p>{weather.weather}</p>
                  <img src={weather.icon} alt="" />
                </div>
              </div>
              <div className="Weather_Content_Container">
                <p>Humidity: {weather.humidity}%</p>
                <p>Visibility: {weather.visibility} km</p>
                <p>Wind Speed: {weather.wind} km/h</p>
              </div>
            </div>
          ) : (
            <div className="Home_Weather_Widget">
              <div className="Weather_Content_Container">
                <p>{message.weather}</p>
              </div>
            </div>
          )}

          <div className="Home_News_Widget">
            <div className="News_Header">
              <p>News</p>
            </div>

            <div className="News_Categories">
              <p
                className={`Button_Primary ${
                  newsCate === 0 ? "HighLight" : ""
                }`}
                onClick={() => setNewsCate(0)}
              >
                All
              </p>
              <p
                className={`Button_Secondary ${
                  newsCate === 1 ? "HighLight" : ""
                }`}
                onClick={() => setNewsCate(1)}
              >
                Tech
              </p>
              <p
                className={`Button_Tertiary ${
                  newsCate === 2 ? "HighLight" : ""
                }`}
                onClick={() => setNewsCate(2)}
              >
                Food
              </p>
            </div>

            <div className="News_Content">
              {news.length === 0 ? (
                <p>{message.news}</p>
              ) : (
                <div>
                  {news.map(function (n, i) {
                    return (
                      <div className="News_Item" key={i}>
                        <div>
                          <a href={n.url}>{fixString(n.title, 10)}</a>
                          <span>
                            {" "}
                            - {n.source.name} - {n.publishedAt.substring(0, 10)}
                          </span>
                        </div>
                        <p>{fixString(n.description, 15)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="Home_Bottom_Container">
          <div className="Home_Task_Widget">
            <div className="Tasks_Header">
              <p>Tasks</p>
            </div>

            <div className="Tasks_Options">
              <div>
                Time:
                <p
                  className={`Button_Primary ${
                    tasksOption.type === 0 ? "HighLight" : ""
                  }`}
                  onClick={() =>
                    setTasksOption((values) => ({ ...values, type: 0 }))
                  }
                >
                  Today
                </p>
                <p
                  className={`Button_Secondary ${
                    tasksOption.type === 1 ? "HighLight" : ""
                  }`}
                  onClick={() =>
                    setTasksOption((values) => ({ ...values, type: 1 }))
                  }
                >
                  All
                </p>
              </div>

              <div>
                Status:
                <p
                  className={`Button_Primary ${
                    tasksOption.status === 0 ? "HighLight" : ""
                  }`}
                  onClick={() =>
                    setTasksOption((values) => ({ ...values, status: 0 }))
                  }
                >
                  All
                </p>
                <p
                  className={`Button_Secondary ${
                    tasksOption.status === 1 ? "HighLight" : ""
                  }`}
                  onClick={() =>
                    setTasksOption((values) => ({ ...values, status: 1 }))
                  }
                >
                  Uncompleted
                </p>
                <p
                  className={`Button_Tertiary ${
                    tasksOption.status === 2 ? "HighLight" : ""
                  }`}
                  onClick={() =>
                    setTasksOption((values) => ({ ...values, status: 2 }))
                  }
                >
                  Completed
                </p>
              </div>
            </div>

            <div className="Tasks_List">
              {filteredTasks.map(function (t, i) {
                return (
                  <div className="Tasks_List_Item" key={i}>
                    <div>
                      <p>{t.task_desc}</p>
                      <p>-</p>
                      <p>{t.task_date}</p>
                      <p>-</p>
                      <p>
                        {parseInt(t.task_status) === 0
                          ? "Uncompleted"
                          : "Completed"}
                      </p>
                    </div>
                    <div>
                      <p
                        onClick={() => {
                          setOpenForm({ mode: 1, status: true });
                          setFormID(t.task_id);
                          setFormDesc(t.task_desc);
                          setFormDate(t.task_date);
                          setFormStatus(parseInt(t.task_status));
                        }}
                      >
                        Edit
                      </p>
                      <p onClick={() => deleteTask(t.task_id)}>Delete</p>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && <p>No record found</p>}
              <div
                className="Tasks_List_Item Add_Button"
                onClick={() => {
                  setOpenForm({ mode: 0, status: true });
                  setFormID(0);
                  setFormDesc("");
                  setFormDate(today);
                  setFormStatus(0);
                }}
              >
                <p>Add a new task</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openForm.status && (
        <div className="Edit_Container">
          <div className="Input_Form">
            <p className="Form_Header">
              {openForm.mode === 0 ? "Create" : "Edit"} Task
            </p>
            <div className="Form_Body">
              <div>
                <p>Enter Description:</p>
                <input
                  type="text"
                  id="desc"
                  name="desc"
                  maxLength={30}
                  value={formDesc}
                  onChange={(e) => {
                    setFormDesc(e.target.value.replace(/\n/g, ""));
                  }}
                />
              </div>
              <div>
                <p>Enter Date:</p>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formDate}
                  onChange={(e) => {
                    setFormDate(e.target.value);
                  }}
                />
              </div>
              <div>
                <p>Enter Status:</p>
                <div>
                  <input
                    type="radio"
                    id="status1"
                    name="status"
                    value="0"
                    checked={formStatus === 0}
                    onChange={() => setFormStatus(0)}
                  />
                  <label>Uncompleted</label>

                  <input
                    type="radio"
                    id="status1"
                    name="status"
                    value="1"
                    checked={formStatus === 1}
                    onChange={() => setFormStatus(1)}
                  />
                  <label>Completed</label>
                </div>
              </div>
            </div>

            <div className="Form_Footer">
              <p
                className="Button_Red"
                onClick={() => setOpenForm({ mode: 0, status: false })}
              >
                Cancel
              </p>
              <p
                className="Button_Submit"
                onClick={() => {
                  submitForm();
                }}
              >
                Submit
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
