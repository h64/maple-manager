import React, { Component } from 'react';
import styles from './RaidParticipationPanel.module.css';
import axios from 'axios';

class RaidParticipation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            raidParticipants: [],
            allCharacters: [],
            currentlySelectedCharacter: '',
            _selectValue: ''
        }
    }

    componentDidMount() {
        axios.get('/api/users')
            .then(response => {
                let users = response.data.users;
                let allCharacters = [];
                // get every character from every user into arr
                users.forEach(user => {
                    user.characters.forEach(character => {
                        allCharacters.push(character);
                    })
                })
                this.setState({
                    allCharacters: allCharacters,
                    currentlySelectedCharacter: allCharacters[0],
                })
            })
            .catch(err => {
                console.log(err);
                //ToDo: Toast an error
            })
    }

    handleCurrentlySelectedCharacterChange = (e) => {
        this.setState({ 
            currentlySelectedCharacter: JSON.parse(e.target.value),
            _selectValue: e.target.value 
        })
    }

    handleAddParticipant = (e) => {
        let participantArr = this.state.raidParticipants;
        let duplicateCharEntry = participantArr.find((participant) => {
            return participant.ign === this.state.currentlySelectedCharacter.ign
        })

        // Add participant to list if not duplicate
        if(!duplicateCharEntry) 
            participantArr.push(this.state.currentlySelectedCharacter)
        else {
            // TODO: toast notification - duplicate character
        }

        this.setState({ raidParticipants: participantArr });
    }

    

    render() {
        let participantSelector =
            <div className={styles.participantSelector}>
                <label htmlFor="participants">Add by IGN:</label>
                <select name="participants"
                    onChange={this.handleCurrentlySelectedCharacterChange}
                    value={this.state._selectValue}>

                    {this.props.allCharacters.map((participant, idx) => (
                        <option key={idx} value={JSON.stringify(participant)}>
                            {participant.ign} - {participant.class} | {participant.level}
                        </option>
                    ))}

                </select>
                <button type="button" value='Add Participant' onClick={this.handleAddParticipant}>Add Participant</button>
            </div>

        let participantList =
            <div className={styles.participantList}>
                {this.state.raidParticipants.map((participant, idx) => (
                    <div key={idx}>{participant.ign} - {participant.class} | {participant.level}</div>
                ))}
            </div>

        return (
            <div className={styles.RaidParticipation}>
                {participantList}
                {participantSelector}
            </div>
        )
    }
}

export default RaidParticipation;