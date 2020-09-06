import React, {useEffect, useState,  Fragment} from 'react';
import logo from './assets/logo.svg';
import './App.css';
import axios from 'axios'
import CustomInput from './components/ui/CustomInput';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const config = {
  headers: {'Access-Control-Allow-Origin': '*'}
};

const url = 'api/'
// const url = 'http://localhost:3000/api/'
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const getApi = async (endpoint) => {
  const proxyurl = ""//"https://cors-anywhere.herokuapp.com/";
  return (await axios.get(`${proxyurl}${url}${endpoint}`, config)).data
}

const postApi = async (endpoint, data) => {
  const proxyurl = ""//"https://cors-anywhere.herokuapp.com/";
  return await axios.post(`${proxyurl}${url}${endpoint}`, data)
}

const deleteApi = async (endpoint, data) => {
  const proxyurl = ""//"https://cors-anywhere.herokuapp.com/";
  return await axios.delete(`${proxyurl}${url}${endpoint}`, data)
}
function App() {
  const [loader, setLoader] = useState(false)
  const [recruit, setRecruit] = useState(true)
  const [prayer, setPrayer] = useState(true)
  const [names, setNames] = useState([])

  const handleRecruit = () => {
    setRecruit(!recruit)
    setPrayer(false)
  }

  const handlePray = async () => {
    const prayers = await getApi('hez/pray')
    console.log(prayers)
    setNames(prayers)
    setRecruit(false)
    setPrayer(!prayer)
  }

  const handleAttack = async () => {
    const prayers = await deleteApi('hez/attack')
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="py-24" style={{backgroundColor: '#0c344b'}}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-white">
          Create my group
        </h2>
        <button
          onClick={() => handleRecruit()}
          className="fetch-button focus:outline-none bg-white font-bold rounded-full py-4 px-8 my-2 shadow-lg uppercase tracking-wider"
        >
          Recruit
        </button>
        <button
          onClick={() => handlePray()}
          className="fetch-button focus:outline-none bg-white font-bold rounded-full py-4 px-8 my-2 shadow-lg uppercase tracking-wider"
        >
          Generate
        </button>
        <button
          onClick={() => handleAttack()}
          className="fetch-button focus:outline-none bg-white font-bold rounded-full py-4 px-8 my-2 shadow-lg uppercase tracking-wider"
        >
          Delete
        </button>
        {loader && <div className="Loader"></div>}
      </div>
    {recruit && <Recruit/>}
    {prayer && <Pray {...{names}}/>}


    </div>

    </div>
  );
}

const Pray = (props) => {
  return (
    <Fragment>
      <div className="prayer">
        <h2>{props.names}</h2>
        </div>
    </Fragment>
  )
}

const Recruit = (props) => {
  const [open, setOpen] = useState(false);
  const [recruit, setRecruit] = useState("")
  const handleClick = async () => {
    console.log(await postApi('hez/create', {name: recruit}))
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return(<Fragment>
    <Container maxWidth="sm">
    <div className="prayer">
        <CustomInput onChange={e => setRecruit(e.target.value)} id="standard-basic" size="medium" color="white" label="Siner" />
        <button onClick={() => handleClick()} className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
          Brainwash
        </button>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {recruit} has join the forces !
        </Alert>
      </Snackbar>
      </div>
    </Container>
  </Fragment>)

}
export default App;
