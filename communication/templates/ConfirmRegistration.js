import React from 'react';

export const ConfirmRegistration =  props => {
    const { fullname } = props;
    return (
     <div>
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous"/>
       <script
         src="https://code.jquery.com/jquery-3.3.1.min.js"
         integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
         crossOrigin="anonymous"></script>
       <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossOrigin="anonymous"></script>
       <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
       <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
       <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
       <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"/>
      <div className="card" style={{ width: '18rem'}}>
        <img className="card-img-top" src="..." alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">Confirm Registrarion</h5>
          <p className="card-text">{`Hi ${fullname}, you registered to TE5, if it was not you, please contact support@te5.com.`}</p>
        </div>
      </div>
     </div>
    );
}
