'use-client'

import { Header } from "@/components/header";
import { HeaderMenu } from "@/components/header-menu";

const Dashboard = () => {
    return (
        <>
            <div className='menu flex'>
            </div>
            <div className='dashboard'>
                <iframe title="Stone_dashboard" width="90%" height='700px' src="https://app.powerbi.com/view?r=eyJrIjoiOTQzMTk2NjAtMmJlYy00MzNlLWJjMDEtNTc5YzgwZmRhMzUxIiwidCI6ImUzNmVlMzhmLTkxYjgtNGRjYS05YjEzLWNhYTUzNjBjOTcxNCIsImMiOjF9&navContentPaneEnabled=false" allowFullScreen="true"></iframe>    
            </div>
        </>
    );
}

export default Dashboard;