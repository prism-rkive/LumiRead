import "./App.css";
import MainComponent from "./components/main";
import Filter from "./components/main/filter";
import Header from "./components/main/header";
import UserComponent from "./components/user";

function App() {
  return (
    <div className="App">
      <div className="Main-wraper">
        <Filter />
        <Header />
        <MainComponent />
      </div>
      <UserComponent />
    </div>
  );
}

export default App;