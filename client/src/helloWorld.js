//helloworls is component that has a bunch of components rendered inside of it

import Greetee from "./greetee";
import Counter from "./counter";

//all components start with capital letters:
export default function HelloWorld() {
    // i can write anything that is emits acceptable content

    //we cant add class though to an element: because its jsx and not html and class has anoter meaning
    //instead we use className

    const myText = <h1>I love jsx</h1>;
    const classForStyle = "another-class";
    const cohortName = "Cayenne";
    //looks like html but its  JSX
    return (
        //component tag  =  <Greetee />
        <div className="some-class">
            Hellooooooooooo, World!
            <Greetee propName={cohortName} />
            <Greetee propName={"merle"} />
            <Greetee />
            <Counter favFood="muffin" />
            {myText}
            <h2 className={classForStyle}>{2 + 2}</h2>
            <h2
                style={{
                    color: "hotpink",
                    fontfamily: "Impact",
                    fontSize: "14px", //not font-size
                }}
            >
                2 + 2
            </h2>
            <h4>{}</h4>
        </div>
        //components always return 1 element
        //i couldnt write another div here
        //you usually have 1 file for 1component
    );
}
