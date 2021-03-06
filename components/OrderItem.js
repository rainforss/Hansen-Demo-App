import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import {
  Badge,
  Flex,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Portal } from "@chakra-ui/portal";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { FaStopCircle } from "react-icons/fa";
import { ImEnter } from "react-icons/im";
import { DARK_GOLD } from "../utils/constants";

export default function OrderItem({ order, cancelOrder, submitOrder }) {
  console.log(order);
  return (
    <AccordionItem my={4} border="none">
      <h2>
        <AccordionButton
          bg={DARK_GOLD}
          color="white"
          _hover={{ color: "black" }}
        >
          <HStack spacing={3} flex="1">
            <Text fontWeight="bold" as="span">
              {order.order.orderSequenceNumber}
            </Text>
            {order.submissionDate && (
              <Text as="span">
                Submitted on{" "}
                {new Date(Date.parse(order.submissionDate)).toDateString()}
              </Text>
            )}
            <Text as="span">
              Created on{" "}
              {new Date(
                Date.parse(order.order.created.timestamp)
              ).toDateString()}
            </Text>
            <Badge
              colorScheme={
                order.order.status === "submitted"
                  ? "green"
                  : order.order.status === "pendingSubmission"
                  ? "yellow"
                  : "red"
              }
            >
              {order.order.status}
            </Badge>
          </HStack>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Flex mt={4}>
            <Popover placement="right-end">
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    {/* <Icon
                    w={6}
                    h={6}
                    as={FaStopCircle}
                    color="red"
                    _hover={{ color: "black" }}
                    cursor="pointer"
                  /> */}
                    <IconButton
                      mr={6}
                      disabled={order.order.status !== "pendingSubmission"}
                      icon={<Icon w={6} h={6} as={FaStopCircle} color="red" />}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="bold">
                        Canceling the order
                      </PopoverHeader>
                      <PopoverBody>
                        <Text>Are you sure you want to cancel the order?</Text>
                        <Flex justify="space-between" mt={4}>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              cancelOrder(order.id);
                              onClose();
                            }}
                          >
                            YES
                          </Button>
                          <Button onClick={onClose}>NO</Button>
                        </Flex>
                      </PopoverBody>
                      <PopoverFooter>
                        <Alert status="warning">
                          <AlertIcon />
                          Cannot be undone
                        </Alert>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </>
              )}
            </Popover>
            <Popover placement="right-end">
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    {/* <Icon
                    w={6}
                    h={6}
                    as={FaStopCircle}
                    color="red"
                    _hover={{ color: "black" }}
                    cursor="pointer"
                  /> */}
                    <IconButton
                      disabled={order.order.status !== "pendingSubmission"}
                      icon={<Icon w={6} h={6} as={ImEnter} color="green" />}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="bold">
                        Submitting the order
                      </PopoverHeader>
                      <PopoverBody>
                        <Text>Are you sure you want to submit the order?</Text>
                        <Flex justify="space-between" mt={4}>
                          <Button
                            colorScheme="green"
                            onClick={() => {
                              submitOrder(
                                order.id,
                                order.order.created.timestamp
                              );
                              onClose();
                            }}
                          >
                            YES
                          </Button>
                          <Button onClick={onClose}>NO</Button>
                        </Flex>
                      </PopoverBody>
                      <PopoverFooter>
                        <Alert status="warning">
                          <AlertIcon />
                          Cannot be undone
                        </Alert>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </>
              )}
            </Popover>
            {/* <VStack
              divider={<StackDivider />}
              align="flex-start"
              w="90%"
              mx="auto"
            >
              {order.orderItems.map((i) => (
                <Flex
                  key={i.OrderKey}
                  justify="space-between"
                  align="center"
                  w="100%"
                >
                  <Text as="span">{i.Name}</Text>
                  <Badge
                    colorScheme={
                      i.Status === "In Progress"
                        ? "green"
                        : i.Status === "Aborted"
                        ? "yellow"
                        : "red"
                    }
                    mx={4}
                  >
                    {i.Status}
                  </Badge>
                </Flex>
              ))}
            </VStack> */}
          </Flex>
        </AccordionPanel>
      </h2>
    </AccordionItem>
  );
}
