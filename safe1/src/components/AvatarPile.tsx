import React, { Component } from 'react';
import FacePile from '@/components/ResidentAvatar';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '@/redux/state';
import { Building, User } from '@/models';

const mapStateToProps = (state: State) => ({
  currentUser: state.currentUser,
  defaultBuilding: state.defaultBuilding,
});

const connector = connect(mapStateToProps);
interface Props extends ConnectedProps<typeof connector> {
  currentUser: User | null,
  defaultBuilding: Building | undefined,
};
interface AvatarState {
  members: { id: number, imageUrl: string }[] | undefined
}
class AvatarPile extends Component<Props, AvatarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      members: []
    }
  }

  componentDidMount(){
    if(this.props.currentUser && this.props.defaultBuilding){
      var members = this.props.defaultBuilding.members;
      var currentUser = this.props.currentUser;
      var otherResidents = members?.filter((mem: User) =>  
        mem.displayName !== currentUser.displayName
      )
      var otherResidentsList = otherResidents?.map((mem: User, idx: number) => ({id: idx, imageUrl: mem.photoURL}))
      this.setState({members: otherResidentsList})
    };
  }

  render () {
    return (
      <FacePile 
          numFaces={4} 
          faces={this.state.members}
      />
    );
  }
}

export default connector(AvatarPile)