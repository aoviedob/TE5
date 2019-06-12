import React from 'react';
import moment from 'moment';

export const Invoice =  props => {
    const { invoice = {} } = props;
    const { id, startDate, endDate, coverImageUrl, createdAt, eventName, eventOrganizerName, customerName, customerEmail, categoryName, categoryPrice, finalPrice } = invoice;

    return (
        <div>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"/>
            <script
              src="https://code.jquery.com/jquery-3.3.1.min.js"
              integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
              crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
            <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
            <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"/>

        <div className="row">
          <div className="col-12">
            <div className="card">
                <div className="card-body p-0">
                    <div className="row p-5">
                        <div className="col-md-6">
                            <img src={coverImageUrl} className="d-block img-fluid" />
                        </div>

                        <div className="col-md-6 text-right">
                            <p className="font-weight-bold mb-1">{`Invoice #${id}`}</p>
                            <p className="text-muted">{`Due to: ${moment(createdAt).format('llll')}`}</p>
                        </div>
                    </div>

                    <hr className="my-5"/>

                    <div className="row pb-5 p-5">
                        <div className="col-md-6">
                          <p className="font-weight-bold mb-4">Event Details</p>
                          <p className="mb-1 invoice-text"><span className="text-muted ">Name: </span>{eventName}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">Organizer: </span>{eventOrganizerName}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">Start Date: </span>{moment(startDate).format('llll')}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">End Date: </span>{moment(endDate).format('llll')}</p>
                        </div>

                        <div className="col-md-6 text-right">
                          <p className="font-weight-bold mb-4">Client Information</p>
                          <p className="mb-1 invoice-text">{customerName}</p>
                          <p className="mb-1 invoice-text">{customerEmail}</p>
                        </div>
                    </div>

                    <div className="row p-5">
                        <div className="col-md-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="border-0 text-uppercase small font-weight-bold">Category</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Price</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Coupon</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{categoryName}</td>
                                        <td>{categoryPrice}</td>
                                        <td>LTS Versions</td>
                                        <td>{finalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex flex-row-reverse bg-dark text-white p-4">
                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Grand Total</div>
                            <div className="h3 font-weight-light">{finalPrice}</div>
                        </div>

                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Discount</div>
                            <div className="h3 font-weight-light">10%</div>
                        </div>

                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Sub - Total amount</div>
                            <div className="h3 font-weight-light">{categoryPrice}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    </div>   
    );
}
