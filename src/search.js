import React from 'react';
import axios from 'axios';

let secrets;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}

let col1 = 0;
let col2 = 0;
let col3 = 0;

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picked: false,
            buttonDisabled: true,
            participants: [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4}
            ]
        };
        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.addParticipant = this.addParticipant.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.reset = this.reset.bind(this);
    }
    handleSearchInput(e) {
        this.address = e.target.value;
        if (this.address.length >= 1) {
            this.setState({ buttonDisabled: false })
        }
    }
    handleClick() {
        const qs = `https://api.foursquare.com/v2/venues/explore?client_id=${secrets.CLIENT_ID}&client_secret=${secrets.CLIENT_SECRET}&query=lunch&near=${this.address}&v=20170801&limit=3`
        axios.get(qs)
            .then(data => {
                console.log(data.data.response.groups[0].items);
                this.setState({ searchResultsArr: data.data.response.groups[0].items });
                this.reset();
            }).catch(err => { console.log(err); });
    }

    handleVote(e) {
        let row = e.classList[3];
        let rowToCheck = document.getElementsByClassName(row);
        for (let i = 0; i < rowToCheck.length; i++) {
            if (rowToCheck[i].classList.contains('picked')) {
                return;
            }
        }
        if (e.classList.contains('1') && e.classList.contains('voting')) {
            col1++;
        } else if (e.classList.contains('2')  && e.classList.contains('voting')) {
            col2++;
        } else if (e.classList.contains('3')  && e.classList.contains('voting')) {
            col3++;
        }
        e.classList.remove("voting");
        e.classList.add("picked");
        this.checkWinner(e);
    }
    checkWinner(e) {
        if (col1 > 1 || col2 > 1 || col3 > 1) {
            if (col1 > col2 && col1 > col3) {
                document.getElementsByClassName('winnerFlip0')[0].classList.add('flip-card-inner');
                document.getElementsByClassName('winnerFlip1')[0].classList.remove('flip-card-inner');
                document.getElementsByClassName('winnerFlip2')[0].classList.remove('flip-card-inner');
            } else if (col2 > col1 && col2 > col3) {
                document.getElementsByClassName('winnerFlip1')[0].classList.add('flip-card-inner');
                document.getElementsByClassName('winnerFlip0')[0].classList.remove('flip-card-inner');
                document.getElementsByClassName('winnerFlip2')[0].classList.remove('flip-card-inner');
            } else if (col3 > col1 && col3 > col1) {
                document.getElementsByClassName('winnerFlip2')[0].classList.add('flip-card-inner');
                document.getElementsByClassName('winnerFlip0')[0].classList.remove('flip-card-inner');
                document.getElementsByClassName('winnerFlip1')[0].classList.remove('flip-card-inner');
            }
        }

    }
    reset() {
        col1 = 0;
        col2 = 0;
        col3 = 0;
        this.setState({
            participants: [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4}
            ]
        });
        console.log("reset all the votes");
        let box = document.getElementsByClassName('box');
        for (let i = 0; i < box.length; i++) {
            box[i].classList.add('voting');
            box[i].classList.remove('picked');
        }
        let winnersToRemove = document.getElementsByClassName('single-search-result');
        for (let i = 0; i < winnersToRemove.length; i++) {
            winnersToRemove[i].classList.remove('winner');
        }
        let inputFields = document.getElementsByClassName('userName');
        for (let j= 0; j < inputFields.length; j++) {
            inputFields[j].value = "";
        }
    }
    addParticipant() {
        let oldId = this.state.participants[this.state.participants.length - 1].id;
        let newId = oldId++;
        let newParticipants = this.state.participants.concat({
            id: newId
        });
        this.setState({ participants: newParticipants })
    }

    render() {
        if (this.state.searchResultsArr === undefined || this.state.searchResultsArr === 'no results') {
            return (
                <div className="searchmodal">
                    <input id="search" name="search" type="text" placeholder="search for a place to eat"  onChange={ this.handleSearchInput }  />
                    <button disabled={this.state.buttonDisabled} className="btn" onClick={ this.handleClick } >Search</button>
                </div>
            );
        } else {
            return (
                <div className="searchmodal">
                    <input id="search" name="search" type="text" placeholder="search for a place to eat" onChange={ this.handleSearchInput }   />
                    <button disabled={this.state.buttonDisabled} className="btn" onClick={ this.handleClick } >Search</button>
                    <div className="search-result">
                        <div className="single-search-result blank"></div>
                        { this.state.searchResultsArr.map( (venue, idx) => (
                                <React.Fragment key={venue.venue.id}>
                                <div className="flip-card">
                                    <div className={'winnerFlip'+ idx}>
                                        <div className={'flip-card-front single-search-result restaurant' + idx} >
                                            <a href={`https://www.google.com/search?q=${venue.venue.name}+${this.address}`} >
                                                <h3>{venue.venue.name} </h3>
                                            </a>
                                            <h5>{venue.venue.categories[0].name} </h5>
                                        </div>
                                        <div className={'flip-card-back single-search-result restaurant' + idx} >
                                            <a href={`https://www.google.com/search?q=${venue.venue.name}+${this.address}`} >
                                                <h3>{venue.venue.name} </h3>
                                            </a>
                                            <h5>{venue.venue.categories[0].name} </h5>
                                        </div>
                                    </div>
                                </div>
                                </React.Fragment>
                            )
                        )}

                        {this.state.participants.map ((p, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <div className="voting">
                                    <input className="userName" id="addname" name="search" type="text" placeholder="Add your name"  onChange={ this.handleSearchInput }  />
                                    </div>
                                    <div className={this.state.picked ? 'box picked 1 row' + idx: 'box voting 1 row' + idx} onClick={(e) => this.handleVote(e.target)}></div>
                                    <div className={this.state.picked ? 'box picked 2 row' + idx: 'box voting 2 row' + idx} onClick={(e) => this.handleVote(e.target)}></div>
                                    <div className={this.state.picked ? 'box picked 3 row' + idx: 'box voting 3 row' + idx} onClick={(e) => this.handleVote(e.target)}></div>
                                </React.Fragment>
                            )

                        })}
                    </div>
                    <button className="btn" onClick={ this.addParticipant }>Add participant</button>
                </div>
            );
        }

    }
}
