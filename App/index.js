// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput } from 'react-native';

const preDefinedRecipients = ['Father', 'Mother', 'Boss', 'Brother', 'Sister'];
const preDefinedOccasions = ['Birthday', 'New Year', 'Christmas', 'Anniversary', 'Graduation'];
const preDefinedStyles = ['Formal', 'Casual', 'Humorous', 'Emotional', 'Inspirational'];

const RecipientScreen = ({ setScreen, setRecipient }) => {
    const [customRecipient, setCustomRecipient] = useState('');

    const handleNext = (recipient) => {
        setRecipient(recipient);
        setScreen('Occasion');
    };

    return (
        <View style={styles.recipientContainer}>
            <Text style={styles.label}>Who is it for?</Text>
            {preDefinedRecipients.map((recipient) => (
                <Button key={recipient} title={recipient} onPress={() => handleNext(recipient)} />
            ))}
            <TextInput
                style={styles.input}
                placeholder="Custom Recipient"
                value={customRecipient}
                onChangeText={setCustomRecipient}
            />
            <Button title="Next" onPress={() => handleNext(customRecipient)} />
        </View>
    );
};

const OccasionScreen = ({ setScreen, setOccasion }) => {
    const [customOccasion, setCustomOccasion] = useState('');

    const handleNext = (occasion) => {
        setOccasion(occasion);
        setScreen('Style');
    };

    return (
        <View style={styles.occasionContainer}>
            <Text style={styles.label}>What's the occasion?</Text>
            {preDefinedOccasions.map((occasion) => (
                <Button key={occasion} title={occasion} onPress={() => handleNext(occasion)} />
            ))}
            <TextInput
                style={styles.input}
                placeholder="Custom Occasion"
                value={customOccasion}
                onChangeText={setCustomOccasion}
            />
            <Button title="Next" onPress={() => handleNext(customOccasion)} />
        </View>
    );
};

const StyleScreen = ({ setScreen, setStyle, handleGreetingRequest }) => {
    const [customStyle, setCustomStyle] = useState('');

    const handleNext = (style) => {
        setStyle(style);
        handleGreetingRequest();
    };

    return (
        <View style={styles.styleContainer}>
            <Text style={styles.label}>Choose a style</Text>
            {preDefinedStyles.map((style) => (
                <Button key={style} title={style} onPress={() => handleNext(style)} />
            ))}
            <TextInput
                style={styles.input}
                placeholder="Custom Style"
                value={customStyle}
                onChangeText={setCustomStyle}
            />
            <Button title="Next" onPress={() => handleNext(customStyle)} />
        </View>
    );
};

const ResultScreen = ({ greeting }) => {
    return (
        <View style={styles.resultContainer}>
            <Text style={styles.label}>Generated Greeting:</Text>
            <Text style={styles.greeting}>{greeting}</Text>
        </View>
    );
};

export default function App() {
    const [screen, setScreen] = useState('Recipient');
    const [recipient, setRecipient] = useState('');
    const [occasion, setOccasion] = useState('');
    const [style, setStyle] = useState('');
    const [greeting, setGreeting] = useState('');

    const handleGreetingRequest = async () => {
        const response = await fetch('http://dev.192.168.1.107.nip.io:3300/chatgpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. Please provide answers for given requests.',
                    },
                    {
                        role: 'user',
                        content: `Write a ${style} greeting for ${recipient} on the occasion of ${occasion}.`,
                    },
                ],
                model: 'gpt-4o',
            }),
        });
        const data = await response.json();
        setGreeting(data.response);
        setScreen('Result');
    };

    const renderScreen = () => {
        switch (screen) {
            case 'Recipient':
                return <RecipientScreen setScreen={setScreen} setRecipient={setRecipient} />;
            case 'Occasion':
                return <OccasionScreen setScreen={setScreen} setOccasion={setOccasion} />;
            case 'Style':
                return <StyleScreen setScreen={setScreen} setStyle={setStyle} handleGreetingRequest={handleGreetingRequest} />;
            case 'Result':
                return <ResultScreen greeting={greeting} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Greeting Generator</Text>
            {renderScreen()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    recipientContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    occasionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    styleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    greeting: {
        fontSize: 16,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
});