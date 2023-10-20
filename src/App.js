import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  const onAddFriendHandling = (friend) => {
    setFriends((friends) => [...friends, friend]);
  };

  const onSelectedHandling = (friend) => {
    setSelectedFriend((currentSelected) =>
      currentSelected?.id === friend.id ? null : friend
    );
  };

  const onSplitBillHandling = (value) => {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  };

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlists
          friends={friends}
          onSelectedHandling={onSelectedHandling}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            setShowAddFriend={setShowAddFriend}
            onAddFriendHandling={onAddFriendHandling}
          />
        )}

        <Button onClick={() => setShowAddFriend((show) => !show)}>
          {showAddFriend !== true ? "Add Friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBillHandling={onSplitBillHandling}
        />
      )}
    </div>
  );
};

const Friendlists = ({ friends, onSelectedHandling, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectedHandling={onSelectedHandling}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, onSelectedHandling, selectedFriend }) => {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You own {friend.name} $ {friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} own you $ {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelectedHandling(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const FormAddFriend = ({ onAddFriendHandling }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const onsubmitHandling = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriendHandling(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  };

  return (
    <form className="form-add-friend" onSubmit={onsubmitHandling}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, onSplitBillHandling }) => {
  const [bill, setBill] = useState("");
  const [payByYou, setPayByYou] = useState("");
  const payByFriend = bill ? bill - payByYou : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const submitHandling = (e) => {
    e.preventDefault();
    if (!bill || !payByYou) return;
    onSplitBillHandling(whoIsPaying === "user" ? payByFriend : -payByYou);
  };
  return (
    <form className="form-split-bill" onSubmit={submitHandling}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={payByYou}
        onChange={(e) => setPayByYou(Number(e.target.value))}
      />
      <label>{selectedFriend.name}'s Expense</label>
      <input type="text" value={payByFriend} disabled />
      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
};

export default App;
