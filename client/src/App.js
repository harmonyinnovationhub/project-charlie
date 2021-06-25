import React, { useEffect, useRef, useState } from "react";
import {BrowserRouter, Route} from 'react-router-dom';
import Signin from './components/Signin'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import SocketIDContextProvider from './context/SocketIDContext'

export default function Home() { 
	 
	return (
		<BrowserRouter >
			<SocketIDContextProvider>
				<Route exact path="/" component={Signin} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/chat" component={Chat} />
			</SocketIDContextProvider>
		</BrowserRouter>
		
	)

}