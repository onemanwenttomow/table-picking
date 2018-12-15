import React from 'react';
import axios from 'axios';

let secrets;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}




export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picked: false,
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
        let address;
    }
    handleSearchInput(e) {
        this.address = e.target.value;
        console.log(this.address);

    }
    handleClick() {
        const qs = `https://api.foursquare.com/v2/venues/explore?client_id=${secrets.CLIENT_ID}&client_secret=${secrets.CLIENT_SECRET}&query=lunch&near=${this.address}&v=20170801&limit=3`
        console.log(qs);
        axios.get(qs)
            .then(data => {
                console.log(data.data.response.groups[0].items);
                this.setState({ searchResultsArr: data.data.response.groups[0].items });
            }).catch(err => { console.log(err); });
    }

    handleVote(e) {
        console.log("clicked! ", e);
        e.classList.add("picked");
    }
    addParticipant() {
        let oldId = this.state.participants[this.state.participants.length - 1].id;
        let newId = oldId++;
        let newParticipants = this.state.participants.concat({
            id: newId
        });
        this.setState(
            { participants:  newParticipants}
        )
    }

    render() {
        if (this.state.searchResultsArr === undefined || this.state.searchResultsArr === 'no results') {
            return (
                <div className="searchmodal">
                    <input id="search" name="search" type="text" placeholder="search for a place to eat"  onChange={ this.handleSearchInput }  />
                    <button className="btn" onClick={ this.handleClick } >Search</button>
                </div>
            );
        } else {
            return (
                <div className="searchmodal">
                    <input id="search" name="search" type="text" placeholder="search for a place to eat" onChange={ this.handleSearchInput }   />
                    <button className="btn" onClick={ this.handleClick } >Search</button>
                    <div className="search-result">
                        <div className="single-search-result blank"></div>
                        { this.state.searchResultsArr.map(
                            venue => (
                                <div className="single-search-result" key={venue.venue.id}>
                                    <a href={`https://www.google.com/search?q=${venue.venue.name}+${this.address}`} >
                                        <h3>{venue.venue.name} </h3>
                                    </a>
                                    <h5>{venue.venue.categories[0].name} </h5>
                                </div>
                            )
                        )}

                        {this.state.participants.map ((p, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <div className="voting">
                                    <input id="addname" name="search" type="text" placeholder="Add your name"  onChange={ this.handleSearchInput }  />
                                    </div>
                                    <div className={this.state.picked ? 'picked': "voting"}   onClick={(e) => this.handleVote(e.target)}></div>
                                    <div className={this.state.picked ? 'picked': "voting"}   onClick={(e) => this.handleVote(e.target)}></div>
                                    <div className={this.state.picked ? 'picked': "voting"}   onClick={(e) => this.handleVote(e.target)}></div>
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
