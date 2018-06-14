import React, {Component} from 'react';
import {Row,Col,ListGroupItem} from 'react-bootstrap';
import Modal from 'react-modal';
import '../FileUpload.css';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import * as API from '../api/API';
import {deleteMember} from "../actions/index";

import {getMembers} from "../actions/index";
import "react-table/react-table.css";


class ListMembers extends Component {

    state = {message:''}

    componentWillMount(){
console.log(this.props.group)
        API.getMembers(this.props.group)
            .then((res) => {

                console.log(res)
                if (res.status == 201) {
                    this.props.getMembers(res.members);
                    console.log(res.members)
                    this.setState({ message: res.message })
                    console.log("Success...")

                }else if (res.status == 401) {

                    this.setState({ message: res.message })
                }
            });
    }

    deleteMember(index, member){
        member.owner=this.props.group.owner;
console.log(member);
        API.deleteMember(member)
            .then((res) => {

                console.log(res)
                if (res.status == 201) {
                    this.props.deleteMember(index);
                    this.setState({ message: res.message })
                    console.log("Success...")

                }else if (res.status == 401) {

                    this.props.history.push('/');
                }
            });
    }

    render() {
        console.log(this.props.memberdata)
        return (

            <div className="col-sm-6">

                <table className="table table-striped table-condensed table-hover table-bordered">
                    <thead>
                    <tr className="justify-content-md-left">

                        <th></th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Group</th>

                    </tr>
                    </thead>

                    <tbody>
                    {this.props.memberdata.members.map((member, index) => {

                        return (
                            <tr className="justify-content-md-left">

                                <td>
                                    <div className="row justify-content-md-left">
                                        <div className="col-md-1"><i className="fa fa-user" ></i></div>
                                        {/*{/!*<div>&#9734;</div>*!/}*/}


                                    </div>
                                </td>
                                <td>
                                    {member.firstname}
                                </td>
                                <td>
                                    {member.lastname}
                                </td>
                                <td>
                                    {member.group}
                                </td>

                                <td>
                                    <button className="btn btn-primary" type="submit"
                                            onClick={() => this.deleteMember(index, member)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    </tbody>
                </table>

            </div>
        );
    }
}


function mapStateToProps(reducerdata) {
    console.log(reducerdata);
    const memberdata = reducerdata.memberreducer;
    console.log(memberdata)
    return {memberdata};
}

function mapDispatchToProps(dispatch) {
    return {
        getMembers : (data) => dispatch(getMembers(data)),
        deleteMember : (index) => dispatch(deleteMember(index))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListMembers));


